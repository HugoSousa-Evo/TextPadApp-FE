import { User } from "../../userPage/userView/User";
import { Operation } from "./Operation";

export class Insert extends Operation {
    public position: number;
    public content: string;
    private sentBy: string;

    constructor (position: number, content: string, user: User) {
        super();
        this.position = position;
        this.content = content;
        this.sentBy = user.name;
    }
}