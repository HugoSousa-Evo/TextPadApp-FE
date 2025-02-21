import React from "react";
import { DocumentView } from "./DocumentView";
import { DocumentPanel } from "./DocumentPanel";
import { User } from "../../textpad/userView/User";

interface FileViewProps {
    documents: DocumentView[],
    refresh: () => Promise<void>,
    setCurrentDocument: (filename: string, owner: User) => void
} 

export const FileView: React.FC<FileViewProps> = (props) => {

    return (
        <div className="pt-8 shadow-lg rounded-lg overflow-hidden mx-4" >
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold">Title</th>
                        <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold">Owner</th>
                        <th className="text-center w-1/4 py-4 px-6 text-gray-600 font-bold">Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    props.documents.map((documentView, index) => 
                    <DocumentPanel 
                        key={index} 
                        document={documentView} 
                        setCurrentDocument={props.setCurrentDocument} 
                        refresh={props.refresh}
                    />)
                }
                </tbody>
            </table>
        </div>
    )
}
