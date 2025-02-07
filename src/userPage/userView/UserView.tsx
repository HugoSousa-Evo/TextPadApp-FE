import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";
import { useFetch } from "../../network/useFetch";

export const UserView: React.FC = () => {

    const fetchUsers = useFetch("userList", 'GET');

    const [userList, setUserList] = React.useState<User[]>([]);

    const getUsernames = React.useCallback(async () => {
       
        const usernameList: User[] = [];
        const users = await fetchUsers();

        if (users instanceof Response) {
            const res = await users.json() as string[];
            if (res.length > 0) {
                res.forEach(username => {
                    usernameList.push({name: username});
                })
                setUserList(usernameList);
            }
        }
        else {
            console.log(users)
        }
    }, [fetchUsers])

    React.useEffect(() => {

        if(userList.length === 0 ) {
            getUsernames();
        }

    }, [userList, getUsernames])

    return (
        <div className="UserView">
            <h3>User List</h3>
            <button onClick={getUsernames} >Refresh</button>
            {
                userList.map((user, index) => <UserDisplay key={index} user={user} />)
            }
        </div>
    )
}