import React from "react";
import "./Textpad.css"
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
    const socket = React.useRef<WebsocketController | null>(null);

    const getFileContents = async () => {
        try {
            const response = await fetch("http://localhost:9002/" + props.filename + "/file?owner=" + props.owner.name, {
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

    const [hasLoaded, setLoad] = React.useState(false)
    
    React.useEffect(() => {
        
        if(textareaRef.current !== null && !hasLoaded) {

            socket.current = new WebsocketController(props.filename, auth.token, props.owner)

            textareaRef.current.oninput = InputHandler(textareaRef, socket.current, auth)

            socket.current.setOnMessage(onWebsocketMessage(textareaRef, auth))
            socket.current.setOnError((ev: Event) => console.log(ev))
            socket.current.setOnClose((_: CloseEvent) => console.log("connection terminated"))

            getFileContents();

            setLoad(true)
        }

    }, [textareaRef, hasLoaded, props])

    // close the socket when client leaves
    React.useEffect(() => {
        return () => socket.current?.close()
    }, [])


    return (
        <>
            <textarea 
                id="textbox"
                ref={textareaRef}
                onKeyDown={KeydownHandler(textareaRef, socket.current!, auth)}
                spellCheck="false" />
        </>
    )
}