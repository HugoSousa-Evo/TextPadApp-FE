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

    const deleteFile = React.useCallback(async () => {
        
        const result = await postDelete();

        if (result.ok) {
            const res = await result.text();
            console.log(res)
            props.setAction({
                msg: `The file "${props.document.name} was deleted"`,
                completed: false
            })
            props.refresh();
        } else { 
            console.log(result);
            props.setAction({completed: true, msg: "The file could not be deleted, either you are trying to delete a file you don't own " + 
                "or the file doesn't exist"
             });
         }
    
    }, [props, postDelete])

    const editFile = React.useCallback(() => {

        //Missing access check

        props.setCurrentDocument(props.document.name, {name: props.document.owner})
        nav("/textpad")
        
    }, [props, nav])

    return (
        <div>
            <h4>{props.document.name}</h4>
            <h5>Owned by: {props.document.owner}</h5>
            <button ref={deleteBtn} onClick={deleteFile} >Delete</button>
            <button ref={editBtn} onClick={editFile} >Edit</button>
        </div>
    )
}