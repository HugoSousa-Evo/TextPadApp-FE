import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { User } from "../userPage/userView/User";
import { useAuth } from "../auth/AuthProvider";
import { Insert } from "./operations/Insert";
import { Delete } from "./operations/Delete";

interface TextpadProps {
    filename: string,
    owner: User
}

export const Textpad: React.FC<TextpadProps> = (props) => {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const auth = useAuth();
    const socket = new WebsocketController(props.filename, auth.token, props.owner);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        
    }, [])

    // --------------------------------------

    // React is dumb and no event class lets me read what was added into the textbox so I made this, yay

    const [load, setLoad] = React.useState(false)

    const handleInput = (e: Event) => {

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
    
    React.useEffect(() => {
        if(textareaRef.current !== null && !load) {
            textareaRef.current.oninput = handleInput
            setLoad(true)
        }
    }, [textareaRef, load])

    // -------------------------------------

    return (
        <div>
            <textarea 
                id="textbox"
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                spellCheck="false" />
        </div>
    )
}