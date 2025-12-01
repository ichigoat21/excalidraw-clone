"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);


  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);


  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
        })
      );
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [token]);


  if (!token) {
    return <div>Loading token...</div>;
  }

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div>
      <Canvas socket={socket} roomId={roomId} token={token} />
    </div>
  );
}
