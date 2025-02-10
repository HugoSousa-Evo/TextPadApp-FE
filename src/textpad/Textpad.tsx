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

    // If there is time do this by websocket instead

    const [users, setUsers] = React.useState(0)

    const fetchRoomUsers = useFetch(props.filename + "/currentUsers?owner=" + props.owner.name, 'GET')

    const getCurrentUsers = React.useCallback(async () => {
        const result = await fetchRoomUsers()

        if(result.ok) {
            const users = await result.text()
            setUsers(parseInt(users))
        } else {
            console.log("error on user load")
        }

    }, [setUsers, fetchRoomUsers])

    const [hasLoaded, setLoad] = React.useState(false)
    
    React.useEffect(() => {
        
        if(textareaRef.current !== null && !hasLoaded) {

            socket.current = new WebsocketController(props.filename, auth.token, props.owner)

            textareaRef.current.oninput = InputHandler(textareaRef, socket.current, auth)

            socket.current.setOnMessage(onWebsocketMessage(textareaRef, auth))
            socket.current.setOnError((ev: Event) => console.log(ev))
            socket.current.setOnClose((_: CloseEvent) => console.log("connection terminated"))

            getFileContents();
            getCurrentUsers();

            setLoad(true)
        }

        const interval = setInterval(() => {
            getCurrentUsers()
        }, 5000)

        return () => clearInterval(interval)

    }, [textareaRef, hasLoaded, props, auth, getFileContents, getCurrentUsers])

    // close the socket when client leaves
    React.useEffect(() => {
        return () => socket.current?.close()
    }, [])

    // add the possiblity to edit the title if owner ??

    return (
        <div className="flex-col px-12 pt-12  w-full">
            <div className="text-right mr-4" >
                <button className="border-2 border-black rounded-md py-1.5 px-4  hover:bg-slate-200 mr-2" >UserList | {users}</button>
                <button className="border-2 border-black rounded-md py-1.5 px-4  hover:bg-slate-200" >D</button>
            </div>
            <div className="flex-row" >
                <h2 className="pl-12 pb-2 underline border-dotted border-6 border-black" >{props.filename}</h2>
                <div className="text-right mr-4 mb-1">
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 font-extrabold">B</button>
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 italic">I</button>
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 underline">S</button>
                </div>
            </div>
            <div className="box-border border-s-black border-solid border-4 rounded-2xl p-6 w-full h-5/6" >
            <textarea 
                className="border-s-black border-dotted border-l-2 pl-4 h-full w-full overflow-y-scroll"
                id="textbox"
                ref={textareaRef}
                onKeyDown={KeydownHandler(textareaRef, socket.current!, auth)}
                spellCheck="false" />
            </div>
        </div>
    )
}