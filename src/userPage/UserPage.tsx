import React from "react";
import "./UserPage.css"
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";
import { User } from "./userView/User";
import { UserActions } from "./userActions/UserActions";

interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const [fileWasCreated, setCreationFlag] = React.useState(false);

    return (
        <div className="UserPage" >
            <UserActions setCreateFlag={(b: boolean) => setCreationFlag(b)} />
            <UserView />
            <FileSearch setCurrentDocument={props.setCurrentDocument} refresh={
                [fileWasCreated, (b: boolean) => setCreationFlag(b)]
                }/>
        </div>
    )
}