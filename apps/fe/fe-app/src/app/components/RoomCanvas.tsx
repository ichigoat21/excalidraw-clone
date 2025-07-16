"use client"

import { useEffect, useRef, useState } from "react";
import { WS_BACKEND } from "../../../config/config";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNGViMjdhNS0xMGQ3LTQ4YzMtYmM4Yi1hOGMzMmU3ZWE5ODkiLCJpYXQiOjE3NTI1ODkzMzl9.wJz0Hu3dc0pI_-rWEWTidoRgUjGXLsuYWfaPYx-qUj8"
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(()=> {
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)
        ws.onopen = () => {
            const message = JSON.stringify({
                type : "join",
                roomId
            })
            setSocket(ws)
        socket?.send(message)
        console.log(message)
    }}, [])

    if(!socket){
        return <div>
            connecting to server....
        </div>
    }

    return <Canvas token={token} socket={socket} roomId={roomId}/>
}