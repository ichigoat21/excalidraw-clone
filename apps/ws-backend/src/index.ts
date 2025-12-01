import { WebSocketServer } from "ws";
import type WebSocket from "ws";
import { JWT_SECRET } from "@repo/config/config";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { client } from "@repo/db-package/client";

const wss = new WebSocketServer({
    port : 8080
})

interface User {
    ws : WebSocket,
    rooms : [],
    userId : string
}
const decoded = (token: string): string | null => {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET)
  
      if (typeof decodedToken === 'object' && 'id' in decodedToken) {
        return (decodedToken as JwtPayload).id as string
      }
  
      return null
    } catch (err) {
      return null
    }
  }

  const users : User[] = []

wss.on('connection', function connection(ws, request) {

    const url = request.url;
    const queryParams = new URLSearchParams(url?.split('?')[1])
    const token = queryParams.get('token')
   
    if (!token){
        ws.close()
        return
    }
    const userId = decoded(token)
    if (!userId){
        ws.close()
        return
    }

    users.push({
        userId,
        ws,
        rooms : []
    })



    ws.on('message', async function message(data){
        let parsedData
        if (typeof data !== 'string'){
            parsedData = JSON.parse(data.toString())
        } else {
            parsedData = JSON.parse(data)
        }
        
       
        if(parsedData.type === "join"){
            const user = users.find(u => u.ws === ws)
        }
        if (parsedData.type === "leave"){
            const user = users.filter(u => u.ws === ws)
        }
        if (parsedData.type === "chat") {
            users.forEach(user => {
                user.ws.send(JSON.stringify({
                    type : "chat",
                    message : parsedData.message,
                    rooms : parsedData.roomId
                }))
            });
        
            await client.chat.create({
                data : {
                    message : parsedData.message,
                    roomId : Number(parsedData.roomId),
                    userId : userId
                }
            });
        }
        
       
    })
})