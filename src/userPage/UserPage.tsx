import React from "react";
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";
import { User } from "./userView/User";
import { useAuth } from "../auth/AuthProvider";


interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const auth = useAuth();

    const [userList, setUserList] = React.useState<User[]>([]);

    const [filenameCreate, setFilenameCreate] = React.useState<string | undefined>(undefined);
    const [userInvite, setUserInvite] = React.useState("");
    const [filenameInvite, setFilenameInvite] = React.useState("");

    const filenameCreateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilename = e.currentTarget.value;
        if (newFilename.length > 0 && newFilename.match("[a-zA-Z0-9]{3,12}")) {
            setFilenameCreate(newFilename);
        }
        else {
            setFilenameCreate(undefined);
        }
    }, [setFilenameCreate])

    const userInviteChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInvite(e.currentTarget.value);
    }, [setUserInvite])

    const filenameInviteChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilenameInvite(e.currentTarget.value);
    }, [setFilenameInvite])

    const createFile = React.useCallback(async () => {
        if (filenameCreate !== undefined) {
            try {
                const response = await fetch("http://localhost:9002/" + auth.currentUser.name + "/createFile/" + filenameCreate, {
                    method: 'POST',
                    headers: {
                        "Authorization":"Bearer " + auth.token
                    }
                })
                const res = await response.text();
                console.log(res)
                
            } catch (error) {
                console.log(error)
            }
        }
        else {
            console.log("not a valid filename")
        }
    }, [filenameCreate])

    const inviteUser = React.useCallback(async () => {
        try {
            const response = await fetch("http://localhost:9002/invite?guest="+ userInvite + "&filename=" + filenameInvite, {
                method: 'POST',
                headers: {
                    "Authorization":"Bearer " + auth.token
                }
            });
            const res = await response.text();
            console.log(res);
            
        } catch (error) {
            console.log(error);
        }
    }, [userInvite, filenameInvite])

    const getUsernames = async () => {
        try {
            const usernameList: User[] = [];
            const response = await fetch("http://localhost:9002/userList", {
                method: 'GET',
                headers: {
                    "Authorization":"Bearer " + auth.token
                }
            });
            const res = await response.json() as string[];
            if (res.length > 0) {
                res.forEach(username => {
                    usernameList.push({name: username});
                })
                setUserList(usernameList);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    // On page load get list of users
    React.useEffect(() => {

        if(userList.length === 0 ) {
            getUsernames();
        }

    }, [userList])
    

    return (
        <div>
            <div>
                <label><b>Create a file</b></label>
                <input id="create" type="text" placeholder="Enter Filename" name="create" onChange={filenameCreateChange} />

                <button onClick={createFile} type="submit" >Create</button>
            </div>
            <div>
                <label><b>Allow user to edit file you own</b></label>
                <input id="guest" type="text" placeholder="Enter Guest Username" name="guest" onChange={userInviteChange} />
                <input id="ownedFile" type="text" placeholder="Enter Filename" name="ownedFile" onChange={filenameInviteChange} />
                <button onClick={inviteUser} type="submit" >Allow</button>
            </div>
            <UserView userList={userList} refresh={getUsernames} />
            <FileSearch setCurrentDocument={props.setCurrentDocument}/>
        </div>
    )
}
