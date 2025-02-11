import React from "react";
import { DocumentView } from "./DocumentView";
import { useNavigate } from "react-router";
import { User } from "../userView/User";
import { useFetch } from "../../network/useFetch";
import { newActionI } from "../UserPage";

interface DocumentPanelProps {
    document: DocumentView
    setCurrentDocument: (filename: string, owner: User) => void,
    setAction: (action: newActionI) => void,
    refresh: () => Promise<void>
}

export const DocumentPanel: React.FC<DocumentPanelProps> = (props) => {

    const nav = useNavigate();

    const deleteBtn = React.useRef<HTMLButtonElement>(null);
    const editBtn = React.useRef<HTMLButtonElement>(null);

    const postDelete = useFetch(props.document.owner + "/deleteFile/" + props.document.name, 'POST');

    // this is using the file contents endpoint, maybe add another endpoint or load the contents here and pass them directly to the textpad
    const checkEditAccess = useFetch(props.document.name + "/file?owner=" + props.document.owner, 'GET');

    const deleteFile = React.useCallback(async () => {
        
        postDelete(
            async (result: Response) => {
                const res = await result.text();
                console.log(res)
                props.setAction({
                    msg: `The file "${props.document.name}" was deleted`,
                    completed: false
                })
                props.refresh();
            },
            (result: Response) => {
                console.log(result);
                props.setAction({completed: true, msg: "The file could not be deleted, either you are trying to delete a file you don't own " + 
                    "or the file doesn't exist"
                 });
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
                props.setAction({completed: true, msg: "You do not have permissions to edit this file"});
            }
        )
        
    }, [props, nav])

    return (
        <div className="grid grid-cols-2 grid-rows-2">
            <h4 className="text-center">{props.document.name}</h4>
            <h5 className="text-center">Owned by: {props.document.owner}</h5>
            <button ref={deleteBtn} onClick={deleteFile} >Delete</button>
            <button ref={editBtn} onClick={editFile} >Edit</button>
        </div>
    )
}