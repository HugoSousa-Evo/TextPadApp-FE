import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";

interface UserViewProps {
    userList: User[],
    refresh: () => Promise<void>
}

export const UserView: React.FC<UserViewProps> = (props) => {

    const handleRefresh = React.useCallback(() => {
        props.refresh();
    }, [props])

    return (
        <div>
            <h3>User List</h3>
            <button onClick={handleRefresh} >Refresh</button>
            {
                props.userList.map((user, index) => <UserDisplay key={index} user={user} />)
            }
        </div>
    )
}