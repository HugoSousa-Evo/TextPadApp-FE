import { Operation } from "./Operation";

export class Close extends Operation {

    public toJson(): string {
        return this.toJsonString("Close");
    }
}