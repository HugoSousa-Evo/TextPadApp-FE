import React from "react";
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";
import { User } from "./userView/User";
import { UserActions } from "./userActions/UserActions";
import { MessageLog } from "./messageLog/MessageLog";
import { useAuth } from "../auth/AuthProvider";
import { ThemeBtn } from "../darkMode/themeBtn";

interface UserPageProps {
    setCurrentDocument: (filename: string, owner: User) => void
}

export interface newActionI {
    completed: boolean,
    msg: string
}

export const UserPage: React.FC<UserPageProps> = (props) => {

    const [newAction, setNewAction] = React.useState<newActionI>({completed: true, msg: ""});
    const [user, setUser] = React.useState("")

    const auth = useAuth()

    React.useEffect(() => {

        if(user.length === 0) {
            setUser(auth.currentUser.name)
        }

    }, [user, auth])

    return (
        <div className="grid grid-cols-2 grid-rows-[0.4fr_1.3fr_1.3fr]" >
            <h3  
                className="my-auto ml-8"
            >{auth.currentUser.name}'s Page</h3>
            <ThemeBtn />
            <UserActions setActionFlag={(b: boolean, msg: string) => setNewAction({
                completed: b,
                msg: msg
            })} />
            <UserView />
            <MessageLog newMessage={newAction.msg} />
            <FileSearch 
                setCurrentDocument={props.setCurrentDocument} 
                newAction={newAction}
                setAction={(action: newActionI) => setNewAction(action)}
                />
        </div>
    )
}