import React from "react";
import { User } from "./User";
import { useAuth } from "../../auth/AuthProvider";

interface UserDisplayProps {
    user: User,
    select: (name: string) => void
}

export const UserDisplay: React.FC<UserDisplayProps> = (props) => {

    const auth = useAuth()

    return (
        <>
        {auth.currentUser.name !== props.user.name && (
            <div className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 overflow-y-scroll" >
                <input id={`user ${props.user.name}`} className="my-auto" type="radio" name="user" onClick={_ => props.select(props.user.name)} />
                <label htmlFor={`user ${props.user.name}`} className="flex w-full cursor-pointer items-center px-3 py-2" >{props.user.name}</label> 
            </div>
            )
        }
        </>
    )
}