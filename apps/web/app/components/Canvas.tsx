"use client"

import { useEffect, useRef, useState } from "react"
import { initDraw } from "../draw/draw"
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleCircleIcon, RectangleHorizontal } from "lucide-react";

export type Tool = "circle" | "rect" | "pencil";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")

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
        <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
    </div>
}

function TopBar({
  selectedTool,
  setSelectedTool
} : {
  selectedTool : Tool,
  setSelectedTool : (s : Tool) => void
}){
  return <div className="fixed top-10 left-10">
    <div className="flex"> 
    <IconButton icon={<Pencil/>} onClick={()=> {
      setSelectedTool("pencil")
    }} activated={selectedTool==='pencil'}/>
    <IconButton icon={<RectangleHorizontal/>} onClick={()=> {
      setSelectedTool("rect")
    }} activated={selectedTool === 'rect'}/>
    <IconButton icon={<Circle/>}  onClick={()=> {
      setSelectedTool("circle")
    }} activated={selectedTool === 'circle'}/>
    </div>
  </div>
}