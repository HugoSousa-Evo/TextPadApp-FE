import React from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useFetch } from "../../network/useFetch";

export const UserActions: React.FC<{ setActionFlag: (b: boolean, msg: string) => void }> = (props) => {

    const auth = useAuth();

    const [filenameCreate, setFilenameCreate] = React.useState<string | undefined>(undefined);
    const [userInvite, setUserInvite] = React.useState("");
    const [filenameInvite, setFilenameInvite] = React.useState("");

    const postFile = useFetch(auth.currentUser.name + "/createFile/" + filenameCreate, 'POST');
    const postInvite = useFetch("invite?guest="+ userInvite + "&filename=" + filenameInvite, 'POST');

    const filenameCreateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilename = e.currentTarget.value;
        if (newFilename.length > 0 && newFilename.match("[a-zA-Z0-9]{3,12}")) {
            setFilenameCreate(newFilename);
        }
        else {
            setFilenameCreate(undefined);
        }
    }, [setFilenameCreate])

    const createFile = React.useCallback(async () => {
        // instead of this check maybe disable the button and show the message on the page
        if (filenameCreate !== undefined) {
            postFile(
                async (result: Response) => {
                    const res = await result.text();
                
                    console.log(res)
                    props.setActionFlag(false, `The file "${filenameCreate}" was created`);
                },
                (result: Response) => { 
                    console.log(result)
                    props.setActionFlag(true, "A file with that name already exists in your documents");
                }
            );
        }
        else {
            console.log("not a valid filename")
        }
    }, [filenameCreate, props, postFile])

    const inviteUser = React.useCallback(async () => {
        
        postInvite(
            async (result: Response) => {
                const res = await result.text();
                console.log(res);
                props.setActionFlag(false, `The user ${userInvite} is now able to edit ${filenameInvite}`);
            },
            (error: Response) => {
                console.log(error);
                props.setActionFlag(true, "The invite was not successful, " + 
                "perhaps the document you are trying to access is not yours or the user you are trying to invite doesn't exist");
            }
        );
        
    }, [postInvite, props, filenameInvite, userInvite])

    return (
        <div className="user-actions">
            <div>
                <label><b>Create a file</b></label>
                <input id="create" type="text" placeholder="Enter Filename" name="create" onChange={filenameCreateChange} />

                <button onClick={createFile} type="submit" >Create</button>
            </div>
            <div>
                <label><b>Allow user to edit file you own</b></label>
                <input id="guest" type="text" placeholder="Enter Guest Username" name="guest" onChange={
                    (e) => setUserInvite(e.currentTarget.value)
                    } />
                <input id="ownedFile" type="text" placeholder="Enter Filename" name="ownedFile" onChange={
                    (e) => setFilenameInvite(e.currentTarget.value)
                    } />
                <button onClick={inviteUser} type="submit" >Allow</button>
            </div>
        </div>
    )
}