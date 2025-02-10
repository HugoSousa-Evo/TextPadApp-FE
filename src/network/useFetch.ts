import React from "react";
import { useAuth } from "../auth/AuthProvider";

export function useFetch(url: string, method: 'GET' | 'POST') {

    const auth = useAuth();

    const makeRequest = React.useCallback(async () => {

        return fetch(process.env.REACT_APP_SERVER_DOMAIN + url, {
            method: method,
            headers: {
                "Authorization":"Bearer " + auth.token
            }
        }).then((res) => {
            return res;
        });

    }, [url, auth, method]);

    return makeRequest
}