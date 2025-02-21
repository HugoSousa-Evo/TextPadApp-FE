import { User } from "../userView/User";
import { Operation } from "./Operation";

export class Delete extends Operation {
    public position: number;
    public amount: number;

    constructor (position: number, amount: number, user: User) {
        super();
        this.position = position;
        this.amount = amount;
        this.sentBy = user.name;
    }

    public toJson(): string {
        return this.toJsonString("Delete");
    }
}