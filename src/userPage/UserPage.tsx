import React from "react";
import "./UserPage.css"
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";
import { User } from "./userView/User";
import { UserActions } from "./userActions/UserActions";
import { MessageLog } from "./messageLog/MessageLog";

interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export interface newActionI {
    completed: boolean,
    msg: string
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const [newAction, setNewAction] = React.useState<newActionI>({completed: true, msg: ""});

    return (
        <div className="UserPage" >
            <UserActions setActionFlag={(b: boolean, msg: string) => setNewAction({
                completed: b,
                msg: msg
            })} />
            <UserView />
            <FileSearch 
                setCurrentDocument={props.setCurrentDocument} 
                newAction={newAction}
                setAction={(action: newActionI) => setNewAction(action)}
                />
            <MessageLog newMessage={newAction.msg} />
        </div>
    )
}