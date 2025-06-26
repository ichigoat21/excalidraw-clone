import {WebSocketServer} from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SIGN} from "@repo/backend-common/config"
const wss = new WebSocketServer({port : 8000})


wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if(!url){
        return;
    }
    const query = url.split("?")[1] 
    const queryParams = new URLSearchParams(query) ;
    const token = queryParams.get('token')

    const decoded = jwt.verify(JWT_SIGN, token as string)
    if (!decoded ||(decoded as JwtPayload).id){
       ws.close
       return;
    }
    
})