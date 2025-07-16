import { useEffect, useRef } from "react"
import { initDraw } from "../../../draw";

type CanvasProps = {
    roomId: string,
    socket: WebSocket,
    token : string
}

export default function Canvas({ roomId, socket, token }: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=> {
        if (canvasRef.current){
            initDraw(canvasRef.current, roomId, socket)
         }
    }, [])

     return <div>
    <canvas ref={canvasRef} width={1900} height={1000}></canvas>
    </div>
}