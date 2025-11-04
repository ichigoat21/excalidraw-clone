"use client"

import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {
    roomId : string
}){
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(()=> {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5MzQ4NjAwLWJhNjMtNDkyZS04ZWMyLWI1YzYyMjdjZDEzNyIsImlhdCI6MTc2MjA5ODEzM30.Hd5Vfzjo16cygc1Lrfa9kSNiHZJsO7HRD7-_wD-llY4`)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type : "join",
                roomId
            }))
        }
    }, [])

    if(!socket){
        return <div>
            connecting to server....
        </div>
    }
    return <div>
        <Canvas socket={socket} roomId={roomId}/>
    </div>
}