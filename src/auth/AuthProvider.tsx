import React, { useState } from "react";
import { User } from "../userPage/userView/User";

interface AuthContextI {
    token: string,
    currentUser: User,
    register: (username: string) => Promise<Boolean>
    logIn: (username: string) => Promise<Boolean>
    logOut: () => void
}

const AuthContext = React.createContext<AuthContextI>({
    token: "",
    currentUser: {name: ""},
    register: (_: string) => Promise.resolve(false),
    logIn: (_: string) => Promise.resolve(false),
    logOut: () => {}
})

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
    children
}) => {

    const [user, setUser] = useState<User>({name: ""});
    const [token, setToken] = useState( localStorage.getItem("token") || "");

    const register = async (username: string) => {
        try {
            const response = await fetch("http://localhost:9002/auth/signIn/" + username, {
                method: 'POST'
            })
            const res = await response.json();
            if (res) {
                console.log("token: " + res);
                setUser({name: username});
                setToken(res);
                localStorage.setItem("token", res)
                return true;
            }
            else {
                console.log("empty response")
                return false;
            }

        } catch (error) {
            console.log(error)
            return false;
        }
    };

    const logIn = async (username: string) => {
        try {
            const response = await fetch("http://localhost:9002/auth/logIn/" + username, {
                method: 'POST'
            })
            const res = await response.json();
            if (res) {
                console.log("token: " + res);
                setUser({name: username});
                setToken(res);
                localStorage.setItem("token", res)
                return true;
            }
            else {
                console.log("empty response")
                return false;
            }

        } catch (error) {
            console.log(error)
            return false;
        }
    };

    const logOut = () => {
        setUser({name: ""});
        setToken("");
        localStorage.removeItem("token");
    };

    const context: AuthContextI = {
        token: token,
        currentUser: user,
        register,
        logIn: logIn,
        logOut: logOut
    }

    return <><AuthContext.Provider value={context}>{children}</AuthContext.Provider></>
}

export const useAuth = () => {
    return React.useContext(AuthContext)
}
