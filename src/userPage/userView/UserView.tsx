import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";
import { useAuth } from "../../auth/AuthProvider";

export const UserView: React.FC = () => {

    const auth = useAuth();

    const [userList, setUserList] = React.useState<User[]>([]);

    const getUsernames = React.useCallback(async () => {
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
    }, [auth])

    // On page load get list of users
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