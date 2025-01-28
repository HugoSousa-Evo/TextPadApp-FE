export abstract class Operation {
    public toJson = () => JSON.stringify(this)
}