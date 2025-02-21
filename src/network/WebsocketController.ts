
import { User } from "../textpad/userView/User"

export class WebsocketController {

    private socket: WebSocket
    private defaultConnection = [
        "ws://localhost:9002/",
        "",
        "/editFile/ws?authToken=",
        "",
        "&owner=",
        ""
    ]

    constructor(filename: string, token: string, owner: User) {
        this.defaultConnection[1] = filename
        this.defaultConnection[3] = token
        this.defaultConnection[5] = owner.name
        this.socket = new WebSocket(this.defaultConnection.join(""))
        console.log("connected")
    }

    public setOnMessage(callback: (ev: MessageEvent) => void) {
        this.socket.onmessage = callback
    }

    public setOnError(callback: (ev: Event) => void) {
        this.socket.onerror = callback
    }

    public send(msg: string) {
        this.socket.send(msg)
    }

    public setOnClose(callback: (ev: CloseEvent) => void) {
        this.socket.onclose = callback
    }

    public close() { 
        if (this.socket.OPEN) {
            this.socket.close()
            //this.socket.send(new Close().toJson())
        }
     }
} 