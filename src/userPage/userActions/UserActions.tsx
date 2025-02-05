import React from "react";
import { useAuth } from "../../auth/AuthProvider";

export const UserActions: React.FC = () => {

    const auth = useAuth();

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
    }, [filenameCreate, auth])

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
    }, [userInvite, filenameInvite, auth])

    return (
        <div className="user-actions">
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
        </div>
    )
}