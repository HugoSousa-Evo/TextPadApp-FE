import React from "react";
import { User } from "./User";

interface UserDisplayProps {
    user: User
}

export const UserDisplay: React.FC<UserDisplayProps> = (props) => {

    return (
        <div>
            <img src="istockphoto-1495088043-612x612.jpg" alt="profileImg" />
            <h5>Username: {props.user.name}</h5>
        </div>
    )
}