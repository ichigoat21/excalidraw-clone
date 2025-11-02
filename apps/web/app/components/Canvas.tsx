"use client"

import { useEffect, useRef } from "react"
import { initDraw } from "../draw/draw"

export default function Canvas({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(()=> {
        if (canvasRef.current){
            initDraw(canvasRef.current, roomId)
        }
    }, [canvasRef])

  

    return <div>
        <canvas ref={canvasRef} height={1000} width={2000}></canvas>
    </div>
}