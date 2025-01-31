import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router";

export const StartPage: React.FC = () => {

    const signInBtn = React.useRef<HTMLButtonElement>(null);
    const logInBtn = React.useRef<HTMLButtonElement>(null);
    const [username, setUsername] = React.useState<string | undefined>(undefined);
    const auth = useAuth();
    const navigate = useNavigate();

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.currentTarget.value;
        if (newUsername.length > 0 && newUsername.match("[a-zA-Z0-9]{3,12}")) {
            setUsername(newUsername);
        }
        else {
            setUsername(undefined);
        }
    }, [username, setUsername])

    const signUser = React.useCallback(() => {
        signInBtn.current!.disabled = true
        logInBtn.current!.disabled = true
        auth.register(username!).then(requestComplete => {
            if(requestComplete){
                navigate("/userpage")
            }
            else {
                alert("something went wrong")
                signInBtn.current!.disabled = false
                logInBtn.current!.disabled = false
            }
        })
    }, [username])

    const logUser = React.useCallback(() => {
        signInBtn.current!.disabled = true
        logInBtn.current!.disabled = true
        auth.logIn(username!).then(requestComplete => {
            if(requestComplete){
                navigate("/userpage")
            }
            else {
                alert("something went wrong")
                signInBtn.current!.disabled = false
                logInBtn.current!.disabled = false
            }
        })
    }, [username])

    React.useEffect(() => {
        if (signInBtn.current !== null && logInBtn.current !== null) {
            const validUsername = username !== undefined
            signInBtn.current.disabled = !validUsername
            logInBtn.current.disabled = !validUsername            
        }
    }, [username])

    return (
        <div>
            <label><b>Username</b></label>
            <input id="user" type="text" placeholder="Enter Username" name="uname" onChange={onUsernameChange} required />

            <button ref={signInBtn} onClick={signUser} type="submit" > SignIn </button>
            <button ref={logInBtn} onClick={logUser} type="submit" > Login </button>
        </div>
    )
}