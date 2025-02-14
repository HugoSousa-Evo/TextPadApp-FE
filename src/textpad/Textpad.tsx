import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { User } from "../userPage/userView/User";
import { useAuth } from "../auth/AuthProvider";
import { InputHandler, KeydownHandler, onWebsocketMessage, removeMarkdown, setMarkdown } from "./EventHandlers";
import { useFetch } from "../network/useFetch";
import MDEditor from "@uiw/react-md-editor";
import { ThemeBtn } from "../darkMode/themeBtn";

export interface TextpadProps {
    filename: string,
    owner: User
}

export const Textpad: React.FC<TextpadProps> = (props) => {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const [contents, setContents] = React.useState("")
    const [visibleUserList, setUserListVisibility] = React.useState(false)

    const auth = useAuth();
    const socket = React.useRef<WebsocketController | null>(null);

    const fetchContents = useFetch(props.filename + "/file?owner=" + props.owner.name, 'GET')

    const getFileContents = React.useCallback(() => {

        fetchContents(
            async (contents: Response) => { 
                const text = await contents.text() 
                textareaRef.current!.value = text;
                setContents(text)
            },
            (contents: Response) => { console.log(contents) }
        )

    }, [fetchContents, setContents])

    // If there is time do this by websocket instead

    const [users, setUsers] = React.useState<string[]>([])

    const fetchRoomUsers = useFetch(props.filename + "/currentUsers?owner=" + props.owner.name, 'GET')

    const getCurrentUsers = React.useCallback(async () => {
        
        fetchRoomUsers(
            async (result: Response) => {
                const users = await result.json() as string[]
                setUsers(users)
            },
            () => {console.log("error on user load")}
        )

    }, [setUsers, fetchRoomUsers])

    const [hasLoaded, setLoad] = React.useState(false)

    React.useEffect(() => {
        
        if(textareaRef.current !== null && !hasLoaded) {

            socket.current = new WebsocketController(props.filename, auth.token, props.owner)

            textareaRef.current.oninput = InputHandler(textareaRef.current, socket.current, auth)
            textareaRef.current.onkeydown = KeydownHandler(textareaRef.current, socket.current, auth)

            socket.current.setOnMessage(onWebsocketMessage(textareaRef.current, auth, () => { setContents(textareaRef.current!.value) }))
            socket.current.setOnError((ev: Event) => console.log(ev))
            socket.current.setOnClose((_: CloseEvent) => console.log("connection terminated"))

            getFileContents();
            getCurrentUsers();

            setLoad(true)
        }

        const interval = setInterval(() => {
            getCurrentUsers()
        }, 2000)

        return () => clearInterval(interval)

    }, [textareaRef, hasLoaded, props, auth, getFileContents, getCurrentUsers])

    // close the socket when client leaves
    React.useEffect(() => {
        return () => socket.current?.close()
    }, [])

    // add the possiblity to edit the title if owner ?

    return (
        <div className="flex-col px-12 pt-12  w-full">
            <div className="mr-4 flex flex-row content-end" >
                {visibleUserList && (
                    <div className="border-2 border-black rounded-md" >
                    {
                        users.map((user, index) => (
                            <div key={index} >
                                <h5>{user}</h5>
                            </div>
                        ))
                    }
                </div>
                )}
                <button className="border-2 border-black rounded-md py-1.5 px-4  hover:bg-slate-200 mr-2"
                onClick={_ => setUserListVisibility(prev => !prev)}
                 >UserList | {users.length}</button>
                <ThemeBtn />
            </div>
            <div className="flex-row" >
                <h2 className="pl-12 pb-2 underline border-dotted border-6 border-black" >{props.filename}</h2>
                <div className="text-right mr-4 mb-1">
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 font-extrabold"
                    onClick={_ => {
                        removeMarkdown(textareaRef.current!, socket.current!, auth)()
                        setContents(textareaRef.current!.value)
                    }}
                    >clear</button>
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 font-extrabold"
                    onClick={_ => {
                        setMarkdown(textareaRef.current!, socket.current!, auth)("b")
                        setContents(textareaRef.current!.value)
                    }}
                    >B</button>
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 italic"
                    onClick={_ => {
                        setMarkdown(textareaRef.current!, socket.current!, auth)("i")
                        setContents(textareaRef.current!.value)
                    }}
                    >I</button>
                    <button className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 underline"
                    onClick={_ => {
                        setMarkdown(textareaRef.current!, socket.current!, auth)("s")
                        setContents(textareaRef.current!.value)
                    }}
                    >S</button>
                </div>
            </div>
            <div className="box-border border-s-black border-solid border-4 rounded-2xl p-6 w-full h-5/6" >
                <textarea 
                    className="border-s-black border-dotted border-l-2 pl-4 h-1/2 w-full overflow-y-scroll"
                    id="textbox"
                    ref={textareaRef}
                    spellCheck="false" 
                    onChange={e => setContents(e.currentTarget.value)}
                />
                <MDEditor.Markdown source={ contents } className="h-1/2 w-full overflow-y-scroll" />
            </div>
        </div>
    )
}