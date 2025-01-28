import { User } from "../../userPage/userView/User";
import { Operation } from "./Operation";

export class Delete extends Operation {
    public position: number;
    public amount: number;
    private sentBy: string;

    constructor (position: number, amount: number, user: User) {
        super();
        this.position = position;
        this.amount = amount;
        this.sentBy = user.name;
    }
}