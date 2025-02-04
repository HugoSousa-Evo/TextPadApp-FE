import { Operation } from "./Operation";

export class Close extends Operation {
    
    constructor () {
        super();
    }

    public toJson(): string {
        return this.toJsonString("Close");
    }
}