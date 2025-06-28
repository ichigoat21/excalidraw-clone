import {WebSocketServer} from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SIGN} from "@repo/backend-common/config"
const wss = new WebSocketServer({port : 8000})


function checkUser(token : string) : string | null {
    const decoded = jwt.verify(JWT_SIGN, token as string)

    if (typeof(decoded) == "string"){
        return null;
    }

    if (!decoded ||decoded.userId){
       return null;
    }
    
    return decoded.userId 
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if(!url){
        return;
    }
    const query = url.split("?")[1] 
    const queryParams = new URLSearchParams(query) ;
    const token = queryParams.get('token')

    if (typeof(token) !== "string"){
        return;
    }
    const userId = checkUser(token)

    if(!userId){
        ws.close()
    }
    ws.on("message", function message(){
       ws.send("pong")
    })
})