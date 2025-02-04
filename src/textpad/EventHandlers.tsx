import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { Insert } from "./operations/Insert";
import { Delete } from "./operations/Delete";
import { AuthContextI } from "../auth/AuthProvider";

export const KeydownHandler = (
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    socket: WebsocketController,
    auth: AuthContextI
) => {
    const callback = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => { 
        const tarea = textareaRef.current!

        if (e.key === "Tab") {
            e.preventDefault();
            const text = tarea.value, s = tarea.selectionStart, end = tarea.selectionEnd;
            textareaRef.current!.value = text.substring(0, s) + '\t' + text.substring(end);
            textareaRef.current!.selectionStart = tarea.selectionEnd = s + 1;
            
            socket.send(new Insert(s,'\t', auth.currentUser).toJson());
        }
        
        if(e.key === "Enter") {
            socket.send(new Insert(tarea.selectionStart, '\n', auth.currentUser).toJson());
        }

        if(e.key === "Backspace" || e.key === "Delete"){
            e.preventDefault();
            let text = tarea.value, s = tarea.selectionStart, end = tarea.selectionEnd;
            let amount = end - s

            const deleteMsg = new Delete(0,0, auth.currentUser);
            
            if(amount == 0) {
                
                deleteMsg.amount = 1
                deleteMsg.position = Math.max(s - 1, 0)

                textareaRef.current!.value = text.substring(0, Math.max(s - 1, 0)) + text.substring(s)
                textareaRef.current!.selectionStart = tarea.selectionEnd = Math.max(s - 1, 0)
            } else {
                
                deleteMsg.amount = amount
                deleteMsg.position = s

                textareaRef.current!.value = text.substring(0, s) + text.substring(s + amount)
                textareaRef.current!.selectionStart = tarea.selectionEnd = s
            }

            socket.send(deleteMsg.toJson());
        }
    }, [textareaRef, socket, auth])

    return callback
}

export const InputHandler = (
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    socket: WebsocketController,
    auth: AuthContextI
) => {
    return (e: Event) => {

        // if content was inserted.  not newlines | tabs | backspace / delete 
        // handles copy and paste text as well
        const ev = e as InputEvent
        if(ev.data != null) {
            socket.send(new Insert(
                textareaRef.current!.selectionStart - ev.data.length,
                ev.data,
                auth.currentUser
            ).toJson());
        }
    }
}

export const onWebsocketMessage = (
    textareaRef: React.RefObject<HTMLTextAreaElement>,
    auth: AuthContextI
) => {

    const Insert = (position: number, content: string) => {
        const txt = textareaRef.current!.value

        if(position == 0) {
            textareaRef.current!.value = content + txt
        }
        if(position >= txt.length){
            textareaRef.current!.value += content
        }
        else{
            textareaRef.current!.value = txt.substring(0, position) + content + txt.substring(position)
        }
    }

    const Delete = (position: number, amount: number) => {
        const txt = textareaRef.current!.value

        if(position == 0) {
            textareaRef.current!.value = txt.substring(amount)
        }
        else{
            textareaRef.current!.value = txt.substring(0, position) + txt.substring(position + amount)
        }
    }

    return (ev: MessageEvent) => {
        const message = JSON.parse(ev.data)
        if (message.sentBy !== auth.currentUser.name) {
            if (message.type === "insert") {
                Insert(message.position, message.content)
            }
            else if (message.type === "delete") {
                Delete(message.position, message.amount)
            }
        }
    }
}
