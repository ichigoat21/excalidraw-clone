"use client"

import { useEffect, useRef } from "react"
import { initDraw } from "../draw/draw"

export type Tool = "circle" | "rect" | "pencil";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          initDraw(canvas, roomId, socket)
        }
      }, [canvasRef])

  

    return <div>
        <canvas ref={canvasRef}></canvas>
    </div>
}