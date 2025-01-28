import React from "react";
import { DocumentView } from "./DocumentView";

interface DocumentPanelProps {
    document: DocumentView
}

export const DocumentPanel: React.FC<DocumentPanelProps> = (props) => {

    const deleteBtn = React.useRef<HTMLButtonElement>(null);
    const editBtn = React.useRef<HTMLButtonElement>(null);

    return (
        <div>
            <h4>{props.document.name}</h4>
            <h5>Owned by: {props.document.owner}</h5>
            <button ref={deleteBtn}>Delete</button>
            <button ref={editBtn}>Edit</button>
        </div>
    )
}