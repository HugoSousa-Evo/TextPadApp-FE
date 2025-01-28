import React from "react";
import { User } from "./User";
import { UserDisplay } from "./UserDisplay";

interface UserViewProps {
    userList: User[]
}

export const UserView: React.FC<UserViewProps> = (props) => {

    return (
        <div>
            <h3>User List</h3>
            {
                props.userList.map(user => <UserDisplay user={user} />)
            }
        </div>
    )
}