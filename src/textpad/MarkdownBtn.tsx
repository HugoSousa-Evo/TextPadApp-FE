import { WebsocketController } from "../network/WebsocketController"
import { User } from "./userView/User"
import { MarkdownOptionsProps } from "./MarkdownOptions"
import { Delete } from "./operations/Delete"
import { Insert } from "./operations/Insert"

interface MarkdownBtnI {
    tag: string,
    style: string,
    components: MarkdownOptionsProps
}

export const MarkdownBtn: React.FC<MarkdownBtnI> = (props) => {

    const setMarkdown = (
        editor: HTMLTextAreaElement,
        socket: WebsocketController,
        user: User
    ) => {
        return (tag: string) => {
            const sStart = editor.selectionStart, sEnd = editor.selectionEnd, end = editor.value.length;
            const markdown = `<${tag}>${editor.value.substring(sStart,sEnd)}</${tag}>`
    
            editor.value = editor.value.substring(0, sStart) + markdown + editor.value.substring(sEnd, end)
    
            const deleteAmount = sEnd - sStart
    
            const deleteMsg = new Delete(sStart, deleteAmount, user)
            const insertMsg = new Insert(sStart, markdown, user)
    
            socket.send(deleteMsg.toJson())
            socket.send(insertMsg.toJson())
        } 
    }

    return (
        <button 
        className={"border-2 border-black rounded-md py-1 px-4  hover:bg-slate-200 active:bg-slate-100 " + props.style}
        onClick={_ => {
            setMarkdown(props.components.editor, props.components.socket, props.components.user)(props.tag)
            props.components.setContents(props.components.editor.value)
        }}
        >{props.tag.toUpperCase()}</button>
    )
}