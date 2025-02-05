import React from "react";
import { DocumentView } from "./DocumentView";
import { useAuth } from "../../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router";
import { User } from "../userView/User";

interface DocumentPanelProps {
    document: DocumentView
    setCurrentDocument: (filename: string, owner: User) => void
    refresh: () => Promise<void>
}

export const DocumentPanel: React.FC<DocumentPanelProps> = (props) => {

    const auth = useAuth();
    const nav = useNavigate();

    const deleteBtn = React.useRef<HTMLButtonElement>(null);
    const editBtn = React.useRef<HTMLButtonElement>(null);

    const deleteFile = React.useCallback(async () => {
        
        try {
            const response = await fetch("http://localhost:9002/" + props.document.owner + "/deleteFile/" + props.document.name, {
                method: 'POST',
                headers: {
                    "Authorization":"Bearer " + auth.token
                }
            })
            const res = await response.text();
            console.log(res)
            props.refresh();
        } catch (error) {
            console.log(error)
        }
        
        
    }, [props])

    const editFile = React.useCallback(() => {

        props.setCurrentDocument(props.document.name, {name: props.document.owner})
        nav("/textpad")
        
    }, [props])

    return (
        <div>
            <h4>{props.document.name}</h4>
            <h5>Owned by: {props.document.owner}</h5>
            <button ref={deleteBtn} onClick={deleteFile} >Delete</button>
            <button ref={editBtn} onClick={editFile} >Edit</button>
        </div>
    )
}