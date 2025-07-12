"use client"

import { useEffect, useRef } from "react";
import { initDraw } from "../../../draw";

export default function CanvasPage({roomId} : {roomId : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    

    useEffect(()=> {
        if (canvasRef.current){
           initDraw(canvasRef.current, roomId)
        }
        
    }, [canvasRef])

    return <div>
    <canvas ref={canvasRef} width={1900} height={1000}></canvas>
    </div>
}