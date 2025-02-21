import React from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useFetch } from "../../network/useFetch";

export const UserActions: React.FC<{refresh: () => Promise<void>}> = (props) => {

    const auth = useAuth();

    const [filenameCreate, setFilenameCreate] = React.useState<string | undefined>(undefined);

    const postFile = useFetch(auth.currentUser.name + "/createFile/" + filenameCreate, 'POST');

    const filenameCreateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilename = e.currentTarget.value;
        if (newFilename.length > 0 && newFilename.match("[a-zA-Z0-9]{3,12}")) {
            setFilenameCreate(newFilename);
        }
        else {
            setFilenameCreate(undefined);
        }
    }, [setFilenameCreate])

    const createFile = React.useCallback(async () => {
        // instead of this check maybe disable the button and show the message on the page
        if (filenameCreate !== undefined) {
            postFile(
                async (result: Response) => {
                    const res = await result.text();
                    props.refresh();
                    console.log(res)
                    alert(`The file "${filenameCreate}" was created`)
                    //props.setActionFlag(false, `The file "${filenameCreate}" was created`);
                },
                (result: Response) => { 
                    console.log(result)
                    //props.setActionFlag(true, "A file with that name already exists in your documents");
                }
            );
        }
        else {
            console.log("not a valid filename")
        }
    }, [filenameCreate, postFile])

    return (
        <div className="m-6">
            <h4 className="mt-6" ><b>Create a file</b></h4>
            <div className="flex flex-grow">
                <input id="create" type="text" placeholder="Enter Filename" name="create" onChange={filenameCreateChange} 
                    className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button onClick={createFile} type="submit" 
                className="mt-4 w-auto text-center min-w-[100px] px-6 py-4 text-white transition-all bg-gray-700 dark:bg-white dark:text-gray-800 rounded-md shadow-md sm:w-auto hover:bg-gray-900 hover:text-white shadow-neutral-00 dark:shadow-neutral-700 hover:shadow-md hover:shadow-neutral-400 hover:-tranneutral-y-px"
                >
                    Create
                </button>
            </div>
        </div>
    )
}