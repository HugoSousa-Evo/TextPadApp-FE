import React from "react";
import { User } from "./User";

interface UserDisplayProps {
    user: User
}

export const UserDisplay: React.FC<UserDisplayProps> = (props) => {

    return (
        <div>
            <h4>Username: {props.user.name}</h4>
        </div>
    )
}