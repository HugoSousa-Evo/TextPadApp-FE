import React from "react";
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";
import { User } from "./userView/User";
import "./UserPage.css"
import { UserActions } from "./userActions/UserActions";


interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    return (
        <div className="UserPage" >
            <UserActions />
            <UserView />
            <FileSearch setCurrentDocument={props.setCurrentDocument}/>
        </div>
    )
}
