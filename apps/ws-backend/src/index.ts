import { WebSocketServer} from "ws"
import type WebSocket from 'ws'
import jwt from "jsonwebtoken"
import {JWT_SIGN} from "@repo/backend-common/config"
import {prisma} from "@repo/db-package/client"


const wss = new WebSocketServer ({port : 8000})


interface User {
    ws: WebSocket; 
    room: string[];
    userId: string;
  }

const users : User[] = []


function checkUser(token : string) : string | null {
    const decoded = jwt.verify(token, JWT_SIGN)

    if (typeof(decoded) == "string"){
        return null;
    }

    if (!decoded || !decoded.userId){
       return null;
    }
    
    return decoded.userId 
}
wss.on("connection", function connection(ws, request) {
    try {
      const url = request.url;
      if (!url) {
        return;
      }
  
      const query = url.split("?")[1];
      const queryParams = new URLSearchParams(query);
      const token = queryParams.get("token");
  
      if (typeof token !== "string") {
        ws.close();
        return;
      }
  
      const userId = checkUser(token);
      console.log(userId);
      if (!userId) {
        ws.close();
        return;
      }
  
      users.push({
        userId,
        room: [],
        ws,
      });
  
      ws.on("message", async function message(data) {
        try {
          let parsedData;
          if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
          } else {
            parsedData = JSON.parse(data);
          }
  
          if (parsedData.type === "join") {
            const user = users.find((u) => u.ws === ws);
            user?.room.push(parsedData.roomId);
          }
  
          if (parsedData.type === "leave") {
            users.filter((u) => u === parsedData.room);
          }
  
          if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

  
            users.forEach((user) => {
              if (user.room.includes(roomId)) {
                user.ws.send(
                  JSON.stringify({
                    type: "chat",
                    message: message,
                    roomId,
                  })
                );
              }
            });
  
            await prisma.chat.create({
              data: {
                roomId: Number(roomId),
                message,
                userId,
              },
            });
          }
        } catch {}
      });
    } catch {}
  });
  