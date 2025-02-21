import { WebsocketController } from "../network/WebsocketController"
import { User } from "./userView/User"
import { MarkdownBtn } from "./MarkdownBtn"
import { Delete } from "./operations/Delete"
import { Insert } from "./operations/Insert"

export interface MarkdownOptionsProps {
    editor: HTMLTextAreaElement,
    socket: WebsocketController,
    user: User,
    setContents: (s: string) => void
}

export const MarkdownOptions: React.FC<MarkdownOptionsProps> = (props) => {

    const removeMarkdown = (
        editor: HTMLTextAreaElement,
        socket: WebsocketController,
        user: User
    ) => { 
        return () => {
            const sStart = editor.selectionStart, sEnd = editor.selectionEnd, end = editor.value.length;
            const withTagRemoved = editor.value.substring(sStart,sEnd).replaceAll(/<[a-zA-Z]+>|<\/[a-zA-Z]+>/g, "")
    
            editor.value = editor.value.substring(0, sStart) + withTagRemoved + editor.value.substring(sEnd, end)
    
            const deleteAmount = sEnd - sStart
    
            const deleteMsg = new Delete(sStart, deleteAmount, user)
            const insertMsg = new Insert(sStart, withTagRemoved, user)
    
            socket.send(deleteMsg.toJson())
            socket.send(insertMsg.toJson())
        }
    }

    return (
        <div className="text-right mr-4 mb-1">
            <button 
            className="border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100"
            onClick={_ => {
                removeMarkdown(props.editor, props.socket, props.user)()
                props.setContents(props.editor.value)
            }}
            >Clear</button>

            <MarkdownBtn style="font-extrabold" tag="b" components={props} />
            <MarkdownBtn style="italic" tag="i" components={props} />
            <MarkdownBtn style="underline" tag="s" components={props} />
        </div>
    )
} 