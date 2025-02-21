
import { WebsocketController } from "../network/WebsocketController";
import { Insert } from "./operations/Insert";
import { Delete } from "./operations/Delete";
import { User } from "./userView/User";

export const KeydownHandler = (
    editor: HTMLTextAreaElement,
    socket: WebsocketController,
    user: User
) => {
    return (e: KeyboardEvent) => { 

        if (e.key === "Tab") {
            e.preventDefault();
            const text = editor.value, s = editor.selectionStart, end = editor.selectionEnd;
            editor.value = text.substring(0, s) + '\t' + text.substring(end);
            editor.selectionStart = editor.selectionEnd = s + 1;
            
            socket.send(new Insert(s,'\t', user).toJson());
        }
        
        if(e.key === "Enter") {
            socket.send(new Insert(editor.selectionStart, '\n', user).toJson());
        }

        if(e.key === "Backspace" || e.key === "Delete"){
            e.preventDefault();
            let text = editor.value, s = editor.selectionStart, end = editor.selectionEnd;
            let amount = end - s

            const deleteMsg = new Delete(0,0, user);
            
            if(amount === 0) {
                
                deleteMsg.amount = 1
                deleteMsg.position = Math.max(s - 1, 0)

                editor.value = text.substring(0, Math.max(s - 1, 0)) + text.substring(s)
                editor.selectionStart = editor.selectionEnd = Math.max(s - 1, 0)
            } else {
                
                deleteMsg.amount = amount
                deleteMsg.position = s

                editor.value = text.substring(0, s) + text.substring(s + amount)
                editor.selectionStart = editor.selectionEnd = s
            }

            socket.send(deleteMsg.toJson());
        }
    }
}

export const InputHandler = (
    editor: HTMLTextAreaElement,
    socket: WebsocketController,
    user: User
) => {
    return (e: Event) => {

        // if content was inserted.  not newlines | tabs | backspace / delete 
        // handles copy and paste text as well
        const ev = e as InputEvent
        if(ev.data !== null) {
            socket.send(new Insert(
                editor.selectionStart - ev.data.length,
                ev.data,
                user
            ).toJson());
        }
    }
}

export const onWebsocketMessage = (
    editor: HTMLTextAreaElement,
    user: User,
    updatePreview: () => void
) => {

    const Insert = (position: number, content: string) => {
        const txt = editor.value

        if(position === 0) {
            editor.value = content + txt
        }
        if(position >= txt.length){
            editor.value += content
        }
        else{
            editor.value = txt.substring(0, position) + content + txt.substring(position)
        }
    }

    const Delete = (position: number, amount: number) => {
        const txt = editor.value

        if(position === 0) {
            editor.value = txt.substring(amount)
        }
        else{
            editor.value = txt.substring(0, position) + txt.substring(position + amount)
        }
    }

    return (ev: MessageEvent) => {
        const message = JSON.parse(ev.data)
        if (message.sentBy !== user.name) {
            if (message.type === "insert") {
                Insert(message.position, message.content)
            }
            else if (message.type === "delete") {
                Delete(message.position, message.amount)
            }
        }
        updatePreview()
    }
}
