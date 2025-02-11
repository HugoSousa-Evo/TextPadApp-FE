import React from "react";
import { useAuth } from "../auth/AuthProvider";

export function useFetch(url: string, method: 'GET' | 'POST') {

    const auth = useAuth();

    const makeRequest = React.useCallback(async (
        onSuccess: (r: Response) => void,
        onError: (r: Response) => void
    ) => {

        const result = await fetch(process.env.REACT_APP_SERVER_DOMAIN + url, {
            method: method,
            headers: {
                "Authorization":"Bearer " + auth.token
            }
        });

        if (result.ok) {
            onSuccess(result)
        } else { onError(result) }

    }, [url, auth, method]);

    return makeRequest
}