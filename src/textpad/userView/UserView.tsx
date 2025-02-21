import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";
import { useFetch } from "../../network/useFetch";
import { Alert } from "../../extras/alertNotification";

interface UserViewProps {
    filename: string
    setVisible: (b: boolean) => void
}

export const UserView: React.FC<UserViewProps> = (props) => {

    const [userList, setUserList] = React.useState<User[]>([]);
    const [selectedUser, setSelected] = React.useState("")

    const fetchUsers = useFetch("userList", 'GET');
    const postInvite = useFetch("invite?guest="+ selectedUser + "&filename=" + props.filename, 'POST');

    const getUsernames = React.useCallback(async () => {
        fetchUsers(
            async (users: Response) => {

                const usernameList: User[] = [];
                const res = await users.json() as string[];
                if (res.length > 0) {
                    res.forEach(username => {
                        usernameList.push({name: username});
                    })
                    setUserList(usernameList);
                }
            },
            (error: Response) => {console.log(error)}
        );
    }, [fetchUsers])

    const inviteUser = React.useCallback(async () => {

        if (selectedUser.length > 0) {
            postInvite(
                async (result: Response) => {
                    const res = await result.text();
                    console.log(res);
                    props.setVisible(false);
                    alert(`The user ${selectedUser} is now able to edit this file`)
                    //props.setActionFlag(false, `The user ${userInvite} is now able to edit ${filenameInvite}`);
                },
                (error: Response) => {
                    console.log(error);
                    //props.setActionFlag(true, "The invite was not successful, " + 
                    //"perhaps the document you are trying to access is not yours or the user you are trying to invite doesn't exist");
                }
            );
        }
        else {
            // alert select user
        }
        
    }, [postInvite])

    React.useEffect(() => {

        if(userList.length === 0 ) {
            getUsernames();
        }

    }, [userList, getUsernames])

    return (
        <div>
            <div id="modelConfirm" className="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 ">
                <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
                    <div className="p-6 pt-0 text-center">
                        <div className="pt-12">
                            <div className="flex flex-col gap-1 p-2 overflow-y-scroll relative rounded-xl border-2 border-slate-200 shadow">
                            {
                                userList.map((user, index) => <UserDisplay key={index} user={user} select={(name: string) => setSelected(name)} />)
                            }
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 grid-rows-1 justify-evenly">
                            <button onClick={inviteUser} 
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                Invite
                            </button>
                            <button 
                                onClick={_ => props.setVisible(false)}
                                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
                                data-modal-toggle="delete-user-modal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}