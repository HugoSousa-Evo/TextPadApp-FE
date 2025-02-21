import React from "react";
import { FileView } from "./fileSearch/FileView";
import { User } from "../textpad/userView/User";
import { UserActions } from "./userActions/UserActions";
import { useAuth } from "../auth/AuthProvider";
import { ThemeBtn } from "../extras/themeBtn";
import { DocumentView } from "./fileSearch/DocumentView";
import { useFetch } from "../network/useFetch";

interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const [user, setUser] = React.useState("")

    const auth = useAuth()

    const [userOwnedDocuments, setUserDocuments] = React.useState<DocumentView[]>([])
    const [userSharedDocuments, setSharedDocuments] = React.useState<DocumentView[]>([])

    const getFiles = useFetch(auth.currentUser.name + "/listFiles", 'GET');

    const searchFile = React.useCallback(async () => {
        const userDocs: DocumentView[] = [];
        const sharedDocs: DocumentView[] = [];

        getFiles(
            async (result: Response) => {
                const res = await result.json() as string[];
                
                res.forEach(fileInfo => {
                    const info = fileInfo.split("/");
                    const doc: DocumentView = {
                        name: info[1],
                        owner: info[0]
                    }
                    if (doc.owner === auth.currentUser.name) {
                        userDocs.push(doc)
                    } else {
                        sharedDocs.push(doc);
                    }
                })
                setUserDocuments(userDocs);
                setSharedDocuments(sharedDocs);
            },
            () => {
                setUserDocuments(userDocs);
                setSharedDocuments(sharedDocs);
            }
        );
        
    }, [setUserDocuments, setSharedDocuments, getFiles, auth]);

    React.useEffect(() => {

        if(user.length === 0) {
            setUser(auth.currentUser.name);
            searchFile();
        }

    }, [user, auth, searchFile, setUser])

    return (
        <div className="grid grid-cols-2 grid-rows-[0.4fr_1fr_1.6fr] m-6 w-full" >
            <h3  className="ml-2 pt-6"
            ><b>{user}'s Page</b></h3>
            <ThemeBtn />
            <div className="row-span-2 mx-4">
                <h4><b>My files</b></h4>
                <hr className="mt-2"></hr>
                <FileView 
                    documents={userOwnedDocuments}
                    setCurrentDocument={props.setCurrentDocument} 
                    refresh={searchFile}
                />
            </div>
            <UserActions refresh={searchFile} />
            <div className="mx-4">
                <h4><b>Shared with me</b></h4>
                <hr className="mt-2"></hr>
                <FileView 
                    documents={userSharedDocuments}
                    setCurrentDocument={props.setCurrentDocument} 
                    refresh={searchFile}
                />
            </div>
        </div>
    )
}