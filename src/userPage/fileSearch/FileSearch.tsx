import React from "react";
import { DocumentView } from "./DocumentView";
import { DocumentPanel } from "./DocumentPanel";
import { User } from "../userView/User";
import { useFetch } from "../../network/useFetch";

interface FileSearchProps {
    setCurrentDocument: (filename: string, owner: User) => void
    refresh: [boolean, (b: boolean) => void]
} 

export const FileSearch: React.FC<FileSearchProps> = (props) => {

    const [documents, setDocuments] = React.useState<DocumentView[]>([]);
    const [username, setUsername] = React.useState("");

    const getFiles = useFetch(username + "/listFiles", 'GET');

    const noFilesRef = React.useRef<HTMLParagraphElement>(null);

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value);
    }, [setUsername]);

    const searchFile = React.useCallback(async () => {
        const newDocs: DocumentView[] = [];
        const result = await getFiles();

        if (result instanceof Response) {
            const res = await result.json() as string[];
            if (res.length > 0) {
                noFilesRef.current!.textContent = "";
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
                noFilesRef.current!.textContent = "No files for that user"
                setDocuments(newDocs);
            }
        }
        else{
            console.log(result)
        }
        
    }, [setDocuments, getFiles]);

    React.useEffect(() => {

        if(props.refresh[0]){
            searchFile();
            props.refresh[1](false);
        }

    }, [props, searchFile])

    return (
        <div className="FileSearch" >
            <h3>Search user files</h3>
            <input id="user" type="text" placeholder="Enter Username" name="uname" onChange={onUsernameChange} />
            <button onClick={searchFile} >Search</button>
            <p ref={noFilesRef} ></p>
            <div className="documents">
            {
                documents.map((documentView, index) => <DocumentPanel key={index} document={documentView} setCurrentDocument={props.setCurrentDocument} refresh={searchFile} />)
            }
            </div>
        </div>
    )
}
