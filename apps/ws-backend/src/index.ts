import {WebSocketServer} from "ws"

const wss = new WebSocketServer({port : 8000})

wss.on("listening", ()=> {
    console.log("listening")
})