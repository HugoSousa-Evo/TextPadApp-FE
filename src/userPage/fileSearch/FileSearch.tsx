import React from "react";
import { DocumentView } from "./DocumentView";
import { DocumentPanel } from "./DocumentPanel";
import { useAuth } from "../../auth/AuthProvider";
import { User } from "../userView/User";

interface FileSearchProps {
    setCurrentDocument: (filename: string, owner: User) => void
} 

export const FileSearch: React.FC<FileSearchProps> = (props) => {

    const [documents, setDocuments] = React.useState<DocumentView[]>([]);
    const [username, setUsername] = React.useState("");
    const auth = useAuth();

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    }, [username, setUsername]);

    const searchFile = React.useCallback(async () => {
        const newDocs: DocumentView[] = [];
        try {
            const response = await fetch("http://localhost:9002/" + username + "/listFiles", {
                method: 'GET',
                headers: {
                    "Authorization":"Bearer " + auth.token
                }
            });
            const res = await response.json() as string[];
            if (res.length > 0) {
                res.forEach(fileInfo => {
                    const info = fileInfo.split("/");
                    const doc: DocumentView = {
                        name: info[1],
                        owner: info[0]
                    }
                    newDocs.push(doc);
                })
                setDocuments(newDocs);
            }
            else {
                console.log("No files for that user");
                setDocuments(newDocs);
            }

        } catch (error) {
            console.log(error);
        }
    }, [username, documents, setDocuments]);

    return (
        <div className="FileSearch" >
            <h3>Search user files</h3>
            <input id="user" type="text" placeholder="Enter Username" name="uname" onChange={onUsernameChange} />
            <button onClick={searchFile} >Search</button>
            <div className="documents">
            {
                documents.map((documentView, index) => <DocumentPanel key={index} document={documentView} setCurrentDocument={props.setCurrentDocument} refresh={searchFile} />)
            }
            </div>
        </div>
    )
}
