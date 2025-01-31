import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
    const auth = useAuth();
    if(auth.token.length === 0) return <Navigate to={"/startpage"} />;
    return <Outlet />
}

export default PrivateRoute;