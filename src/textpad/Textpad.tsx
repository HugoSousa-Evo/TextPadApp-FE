import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { User } from "../userPage/userView/User";
import { useAuth } from "../auth/AuthProvider";
import { InputHandler, KeydownHandler, onWebsocketMessage } from "./EventHandlers";
import { useFetch } from "../network/useFetch";

export interface TextpadProps {
    filename: string,
    owner: User
}

export const Textpad: React.FC<TextpadProps> = (props) => {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const auth = useAuth();
    const socket = React.useRef<WebsocketController | null>(null);

    const fetchContents = useFetch(props.filename + "/file?owner=" + props.owner.name, 'GET')

    const getFileContents = React.useCallback(async () => {

        const contents = await fetchContents()
        
        if (contents instanceof Response) {
            textareaRef.current!.value = await contents.text()
        }
        else {
            console.log(contents)
        }
    }, [fetchContents])

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

    }, [textareaRef, hasLoaded, props, auth, getFileContents])

    // close the socket when client leaves
    React.useEffect(() => {
        return () => socket.current?.close()
    }, [])


    return (
        <div className="flex-grow pl-12 pr-12">
            <h4 className="p-8" >{props.filename}</h4>
            <textarea 
                className="box-border border-s-black border-solid border-4 rounded-2xl p-8 w-full h-full overflow-y-scroll"
                id="textbox"
                ref={textareaRef}
                onKeyDown={KeydownHandler(textareaRef, socket.current!, auth)}
                spellCheck="false" />
        </div>
    )
}