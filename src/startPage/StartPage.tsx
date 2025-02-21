import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router";
import "./StartPage.css"
import { ThemeBtn } from "../extras/themeBtn";

export const StartPage: React.FC = () => {

    const signInBtn = React.useRef<HTMLButtonElement>(null);
    const logInBtn = React.useRef<HTMLButtonElement>(null);
    const [username, setUsername] = React.useState<string | undefined>(undefined);
    const auth = useAuth();
    const navigate = useNavigate();

    const onUsernameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.currentTarget.value;
        if (newUsername.length > 0 && newUsername.match("^[a-zA-Z0-9]{3,12}$")) {
            setUsername(newUsername);
        }
        else {
            setUsername(undefined);
        }
    }, [setUsername])

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
    }, [username, auth, navigate])

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
    }, [username, auth, navigate])

    React.useEffect(() => {
        if (signInBtn.current !== null && logInBtn.current !== null) {
            const validUsername = username !== undefined
            signInBtn.current.disabled = !validUsername
            logInBtn.current.disabled = !validUsername            
        }
    }, [username])

    return (
        <div className="h-full w-full" >
            <div className="text-end" >
                <ThemeBtn />
            </div>
            <div className="border-black border-double border-4 rounded-2xl w-8/12 h-3/5 text-center mx-auto mt-32 bg-[#F7F7F7] flex flex-col justify-evenly" >

                <h2 className="" >Welcome to Textpad Collab</h2>

                <label id="usernameStartPage" htmlFor="usernameStartPageInput"><h5 className="" >To start please enter your Username below:</h5></label>
                <input id="usernameStartPageInput" type="text" placeholder="Enter Username" name="uname" onChange={onUsernameChange} required />
                {username === undefined && (
                    <p className="">Username should have between 3 and 12 characters</p>
                )}

                <div className="flex justify-evenly">
                    <div>
                        <label id="usernameStartPage" htmlFor="signinButton"><h5 className="">I'm new here</h5></label>
                        <button 
                        id="signinButton" 
                        className="StartPageButton mt-4 h-15 w-36 bg-white border-2 border-solid border-[#222222] rounded-lg text-[#222222] cursor-pointer inline-block m-0 px-4 py-2" 
                        ref={signInBtn} 
                        onClick={signUser} 
                        type="submit" > Register </button>
                    </div>

                    <div>
                        <label id="usernameStartPage" htmlFor="loginButton"><h5 className="">I have an account</h5></label>
                        <button 
                        id="loginButton" 
                        className="StartPageButton mt-4 h-15 w-36 bg-white border-2 border-solid border-[#222222] rounded-lg text-[#222222] cursor-pointer inline-block m-0 px-4 py-2" 
                        ref={logInBtn} 
                        onClick={logUser} 
                        type="submit" > Login </button>
                    </div>
                </div>
            </div>
        </div>
    )
}