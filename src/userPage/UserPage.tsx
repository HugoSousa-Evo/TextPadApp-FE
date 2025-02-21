import React from "react";
import { FileView } from "./fileSearch/FileView";
import { User } from "../textpad/userView/User";
import { UserActions } from "./userActions/UserActions";
import { useAuth } from "../auth/AuthProvider";
import { ThemeBtn } from "../extras/themeBtn";
import { DocumentParams } from "./fileSearch/DocumentParams";
import { useFetch } from "../network/useFetch";

interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const [user, setUser] = React.useState("")

    const auth = useAuth()

    const [userOwnedDocuments, setUserDocuments] = React.useState<DocumentParams[]>([])
    const [userSharedDocuments, setSharedDocuments] = React.useState<DocumentParams[]>([])

    const getFiles = useFetch(auth.currentUser.name + "/listFiles", 'GET');

    const searchFile = React.useCallback(async () => {
        const userDocs: DocumentParams[] = [];
        const sharedDocs: DocumentParams[] = [];

        getFiles(
            async (result: Response) => {
                const res = await result.json() as string[];
                
                res.forEach(fileInfo => {
                    const info = fileInfo.split("/");
                    const doc: DocumentParams = {
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
        <div className="grid grid-cols-2 grid-rows-[0.4fr_1fr_1.6fr] p-6 w-full" >
            <h3  className="ml-2 pt-6"
            ><b>{user}'s User Page</b></h3>
            <ThemeBtn />
            <div className="row-span-2 mx-4">
                <h4 className=""><b>My files</b></h4>
                <hr className="mt-2"></hr>
                <FileView 
                    documents={userOwnedDocuments}
                    setCurrentDocument={props.setCurrentDocument} 
                    refresh={searchFile}
                />
            </div>
            <UserActions refresh={searchFile} />
            <div className="mx-4">
                <h4 className=""><b>Shared with me</b></h4>
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