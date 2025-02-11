import React from "react";
import { DocumentView } from "./DocumentView";
import { DocumentPanel } from "./DocumentPanel";
import { User } from "../userView/User";
import { useFetch } from "../../network/useFetch";
import { newActionI } from "../UserPage";

interface FileSearchProps {
    setCurrentDocument: (filename: string, owner: User) => void,
    newAction: newActionI,
    setAction: (action: newActionI) => void
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

        if (username.length > 0) {
            getFiles(
                async (result: Response) => {
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
                },
                () => {
                    noFilesRef.current!.textContent = "No files for that user"
                        setDocuments(newDocs);
                }
            );

            } else {
                noFilesRef.current!.textContent = "No files for that user"
                setDocuments(newDocs);
            }
        
    }, [setDocuments, getFiles, username]);

    React.useEffect(() => {

        if(!props.newAction.completed){
            searchFile();
            props.setAction({
                msg: props.newAction.msg,
                completed: true
            })
        }

    }, [props, searchFile])

    return (
        <div className="w-full, h-full pl-8 pt-8" >
            <h3>Search user files</h3>
            <input id="user" type="text" placeholder="Enter Username" name="uname" onChange={onUsernameChange} />
            <button onClick={searchFile} >Search</button>
            <p ref={noFilesRef} ></p>
            <div className="pt-8 flex flex-col flex-auto overflow-y-scroll">
            {
                documents.map((documentView, index) => 
                <DocumentPanel 
                    key={index} 
                    document={documentView} 
                    setCurrentDocument={props.setCurrentDocument} 
                    refresh={searchFile}
                    setAction={props.setAction} 
                />)
            }
            </div>
        </div>
    )
}
