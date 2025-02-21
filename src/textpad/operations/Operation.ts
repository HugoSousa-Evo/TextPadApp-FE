export abstract class Operation {

    public sentBy: string = "";

    public toJsonString = (type: string) => `{"${type}":${JSON.stringify(this)}}`
}