import React from "react";
import { DocumentParams } from "./DocumentParams";
import { useNavigate } from "react-router";
import { User } from "../../textpad/userView/User";
import { useFetch } from "../../network/useFetch";

interface DocumentPanelProps {
    document: DocumentParams
    setCurrentDocument: (filename: string, owner: User) => void,
    refresh: () => Promise<void>
}

export const DocumentPanel: React.FC<DocumentPanelProps> = (props) => {

    const nav = useNavigate();

    const deleteBtn = React.useRef<HTMLButtonElement>(null);

    const postDelete = useFetch(props.document.owner + "/deleteFile/" + props.document.name, 'POST');

    // this is using the file contents endpoint, maybe add another endpoint or load the contents here and pass them directly to the textpad
    const checkEditAccess = useFetch(props.document.name + "/file?owner=" + props.document.owner, 'GET');

    const deleteFile = React.useCallback(async () => {
        
        postDelete(
            async (result: Response) => {
                const res = await result.text();
                console.log(res)
                alert(`The file "${props.document.name}" was deleted`)
                /*props.setAction({
                    msg: `The file "${props.document.name}" was deleted`,
                    completed: false
                })*/
                props.refresh();
            },
            (result: Response) => {
                console.log(result);
                /*props.setAction({completed: true, msg: "The file could not be deleted, either you are trying to delete a file you don't own " + 
                    "or the file doesn't exist"
                 });*/
            }
        );
    
    }, [props, postDelete])

    const editFile = React.useCallback(async () => {

        checkEditAccess(
            () => { 
                props.setCurrentDocument(props.document.name, {name: props.document.owner})
                nav("/textpad")
            },
            (result: Response) => {
                console.log(result);
                //props.setAction({completed: true, msg: "You do not have permissions to edit this file"});
            }
        )
        
    }, [props, nav, checkEditAccess])

    return (
        <tr onClick={editFile} className="hover:bg-slate-50">
            <td className="py-4 px-6 border-b border-gray-200" >
                {props.document.name}
            </td>
            <td className="py-4 px-6 border-b border-gray-200">
                {props.document.owner}
            </td>
            <td className="text-center py-4 px-6 border-b border-gray-200">
                <button ref={deleteBtn} onClick={deleteFile} className="bg-red-500 text-white py-1 px-2 rounded-full text-sm" >Delete</button>
            </td>
        </tr>
    )
}