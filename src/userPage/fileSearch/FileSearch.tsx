import React from "react";
import { DocumentView } from "./DocumentView";
import { DocumentPanel } from "./DocumentPanel";

interface FileSearchProps {
    documents: DocumentView[]
}

export const FileSearch: React.FC<FileSearchProps> = (props) => {

    return (
        <div>
            <h3>Search user files</h3>
            {
                props.documents.map(documentView => <DocumentPanel document={documentView} />)
            }
        </div>
    )
}