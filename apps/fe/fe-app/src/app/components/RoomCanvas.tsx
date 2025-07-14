"use client"

import { useEffect, useRef, useState } from "react";
import { WS_BACKEND } from "../../../config/config";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){

    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(()=> {
        const ws = new WebSocket(WS_BACKEND)
        ws.onopen = () => {
            setSocket(ws)
        socket?.send(JSON.stringify({
            type : "join_room",
            roomId
        }))
    }}, [])

    if(!socket){
        return <div>
            connecting to server....
        </div>
    }

    return <Canvas roomId={roomId}/>
}