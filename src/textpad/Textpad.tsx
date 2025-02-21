import React from "react";
import { WebsocketController } from "../network/WebsocketController";
import { User } from "./userView/User";
import { useAuth } from "../auth/AuthProvider";
import { InputHandler, KeydownHandler, onWebsocketMessage} from "./EventHandlers";
import { useFetch } from "../network/useFetch";
import MDEditor from "@uiw/react-md-editor";
import { ThemeBtn } from "../extras/themeBtn";
import { MarkdownOptions } from "./MarkdownOptions";
import { UserView } from "./userView/UserView";

export interface TextpadProps {
    filename: string,
    owner: User
}

export const Textpad: React.FC<TextpadProps> = (props) => {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const [contents, setContents] = React.useState("")
    const [visibleUserList, setUserListVisibility] = React.useState(false)
    const [inviteOverlay, setOverlay] = React.useState(false)

    const overlay = React.useCallback(() => {

        if(!inviteOverlay) {
            document.getElementById('modelConfirm')!.style.display = 'none'
            document.getElementsByTagName('body')[0].classList.remove('overflow-y-hidden')
        } else {
            document.getElementById('modelConfirm')!.style.display = 'block'
            document.getElementsByTagName('body')[0].classList.add('overflow-y-hidden')
        }

    }, [inviteOverlay])

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

        overlay()
        
        if(textareaRef.current !== null && !hasLoaded) {

            socket.current = new WebsocketController(props.filename, auth.token, props.owner)

            textareaRef.current.oninput = InputHandler(textareaRef.current, socket.current, auth.currentUser)
            textareaRef.current.onkeydown = KeydownHandler(textareaRef.current, socket.current, auth.currentUser)

            socket.current.setOnMessage(onWebsocketMessage(textareaRef.current, auth.currentUser, () => { setContents(textareaRef.current!.value) }))
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

    }, [textareaRef, hasLoaded, props, auth, getFileContents, getCurrentUsers, inviteOverlay])

    // close the socket when client leaves
    React.useEffect(() => {
        return () => socket.current?.close()
    }, [])

    // add the possiblity to edit the title if owner ?


    return (
        <div className="w-full">
            <UserView filename={props.filename} setVisible={(b: boolean) => setOverlay(b)}/>
            <div className="flex flex-row justify-end pt-4 relative" >
                {visibleUserList && (
                    <div className="flex flex-col gap-1 p-2 overflow-y-scroll absolute right-1/4 mr-14 rounded-xl border-2 border-slate-200 shadow w-fit" >
                    {
                        users.map((user, index) => (
                            <div key={index} className="text-center" >
                                <h5>{user}</h5>
                            </div>
                        ))
                    }
                    </div>
                )}
                <button className="border-2 border-black rounded-md py-1.5 px-4 w-36 hover:bg-slate-200 mr-2 h-12"
                onClick={_ => setUserListVisibility(prev => !prev)}>
                    UserList | {users.length}
                 </button>
                 {
                    props.owner.name === auth.currentUser.name && (
                        <button className="border-2 border-black rounded-md py-1.5 px-4 w-36 hover:bg-slate-200 mr-2 h-12"
                            onClick={_ => setOverlay(true)}>
                            Share
                        </button>
                    )
                 }
                <ThemeBtn />
            </div>
            <div className="flex-col px-12 h-5/6 w-full">
                <div className="" >
                    <h2 className="pl-12 pb-2 underline" >{props.filename}</h2>
                    <MarkdownOptions editor={textareaRef.current!} socket={socket.current!} user={auth.currentUser} setContents={(s: string) => setContents(s)} />
                </div>
                <div className="flex flex-row box-border border-s-black border-solid border-4 rounded-2xl p-6 w-full h-full" >
                    <textarea 
                        className="border-s-black border-dotted border-l-2 px-4 h-full w-1/2 overflow-y-scroll"
                        id="textbox"
                        ref={textareaRef}
                        spellCheck="false" 
                        onChange={e => setContents(e.currentTarget.value)}
                    />
                    <MDEditor.Markdown source={ contents } className="pl-4 h-full w-1/2 overflow-y-scroll" style={{
                        backgroundColor: "white",
                        color: "black",
                        borderLeft: "solid"
                    }} />
                </div>
            </div>
        </div>
        
    )
}