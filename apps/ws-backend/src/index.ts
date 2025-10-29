import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/config/config";
import jwt, { JwtPayload } from 'jsonwebtoken'

const wss = new WebSocketServer({
    port : 8080
})

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

wss.on('connection', function connection(ws, request) {

    const url = request.url;
    const queryParams = new URLSearchParams(url?.split('?')[1])
    const token = queryParams.get('token')
    if (!token){
        ws.close()
        return
    }
    const userAuthenticated = decoded(token)
    if (!userAuthenticated){
        ws.close()
        return
    }
    


    ws.on('message', function message(data){
        ws.send('pong')
    })
})