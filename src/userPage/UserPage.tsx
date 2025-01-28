import React from "react";
import { UserView } from "./userView/UserView";
import { FileSearch } from "./fileSearch/FileSearch";

export const UserPage: React.FC = () => {

    return (
        <div>
            <div>
                <label><b>Create a file</b></label>
                <input id="create" type="text" placeholder="Enter Filename" name="create" />

                <button type="submit" >Create</button>
            </div>
            <div>
                <label><b>Allow user to edit file you own</b></label>
                <input id="guest" type="text" placeholder="Enter Guest Username" name="guest" />
                <input id="ownedFile" type="text" placeholder="Enter Filename" name="ownedFile" />
                <button type="submit" >Allow</button>
            </div>
            <UserView userList={[]}/>
            <FileSearch documents={[]}/>
        </div>
    )
}