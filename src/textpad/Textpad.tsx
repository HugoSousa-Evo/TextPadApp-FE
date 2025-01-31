import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { User } from "../userPage/userView/User";
import { useAuth } from "../auth/AuthProvider";
import { InputHandler, KeydownHandler, onWebsocketMessage } from "./EventHandlers";

export interface TextpadProps {
    filename: string,
    owner: User
}

export const Textpad: React.FC<TextpadProps> = (props) => {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const auth = useAuth();
    const socket = new WebsocketController(props.filename, auth.token, props.owner);

    const getFileContents = async () => {
        try {
            const response = await fetch("http://localhost:9002/" + props.filename + "/file?owner=" + props.owner, {
                method: 'GET',
                headers: {
                    "Authorization":"Bearer " + auth.token
                }
            })
            const res = await response.text();
            textareaRef.current!.value = res
        } catch (error) {
            console.log(error)
        }
    }

    const [load, setLoad] = React.useState(false)
    
    React.useEffect(() => {
        if(textareaRef.current !== null && !load) {
            textareaRef.current.oninput = InputHandler(textareaRef, socket, auth)

            getFileContents();

            socket.setOnMessage(onWebsocketMessage(textareaRef, auth))
            socket.setOnError((ev: Event) => console.log(ev))

            setLoad(true)
        }
    }, [textareaRef, load, props])


    return (
        <div>
            <textarea 
                id="textbox"
                ref={textareaRef}
                onKeyDown={KeydownHandler(textareaRef, socket, auth)}
                spellCheck="false" />
        </div>
    )
}