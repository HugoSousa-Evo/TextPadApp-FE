import { User } from "../userView/User";
import { Operation } from "./Operation";

export class Insert extends Operation {
    public position: number;
    public content: string;

    constructor (position: number, content: string, user: User) {
        super();
        this.position = position;
        this.content = content;
        this.sentBy = user.name;
    }
    
    public toJson(): string {
        return this.toJsonString("Insert")
    }
}