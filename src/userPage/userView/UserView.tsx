import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";
import { useFetch } from "../../network/useFetch";

export const UserView: React.FC = () => {

    const fetchUsers = useFetch("userList", 'GET');

    const [userList, setUserList] = React.useState<User[]>([]);

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

    React.useEffect(() => {

        if(userList.length === 0 ) {
            getUsernames();
        }

    }, [userList, getUsernames])

    return (
        <div className=" w-full, h-full border-2 border-black pl-8 pt-8">
            <h3>User List</h3>
            <button onClick={getUsernames} >Refresh</button>
            <div className="flex flex-col flex-auto overflow-y-scroll border-2 border-black">
            {
                userList.map((user, index) => <UserDisplay key={index} user={user} />)
            }
            </div>
        </div>
    )
}