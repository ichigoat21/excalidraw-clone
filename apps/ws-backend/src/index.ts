import { WebSocketServer } from "ws";
import type WebSocket from "ws";
import { JWT_SECRET } from "@repo/config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { client } from "@repo/db-package/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[]; 
  userId: string;
}

const decoded = (token: string): string | null => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (typeof decodedToken === "object" && "id" in decodedToken) {
      return (decodedToken as JwtPayload).id as string;
    }
    return null;
  } catch {
    return null;
  }
};

const users: User[] = [];

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.close();
    return;
  }

  const userId = decoded(token);
  if (!userId) {
    ws.close();
    return;
  }

  const user: User = { userId, ws, rooms: [] };
  users.push(user);

  // FIX: Remove user from the list when they disconnect so dead sockets
  // don't accumulate and cause broadcast errors over time.
  ws.on("close", () => {
    const idx = users.findIndex((u) => u.ws === ws);
    if (idx !== -1) users.splice(idx, 1);
  });

  ws.on("message", async function message(data) {
    let parsedData: any;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    // FIX: Actually store the roomId on the user so we can scope broadcasts.
    // Previously the user was found but nothing was done with it.
    if (parsedData.type === "join") {
      const user = users.find((u) => u.ws === ws);
      if (user && !user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

    // FIX: Actually remove the room from the user on leave.
    if (parsedData.type === "leave") {
      const user = users.find((u) => u.ws === ws);
      if (user) {
        user.rooms = user.rooms.filter((r) => r !== parsedData.roomId);
      }
    }

    if (parsedData.type === "chat") {
      // FIX 1: Only broadcast to users who have joined this room,
      //         not to every connected socket.
      // FIX 2: Use key "roomId" (not "rooms") so the client can read it.
      users
        .filter((u) => u.rooms.includes(parsedData.roomId))
        .forEach((u) => {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              message: parsedData.message,
              roomId: parsedData.roomId, // was: rooms: parsedData.roomId
            })
          );
        });

      await client.chat.create({
        data: {
          message: parsedData.message,
          roomId: Number(parsedData.roomId),
          userId: userId,
        },
      });
    }
  });
});