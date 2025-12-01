"use client"

import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { Game } from "../draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export default function Canvas({roomId, socket, token} : {roomId : string, socket : WebSocket, token : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [game, setGame] = useState<Game>()
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")

    useEffect(()=> {
      console.log(localStorage.getItem("token"))
      game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          const g = new Game(canvas, roomId, socket, token)
          setGame(g)

          return () => {
            g.destroy()
          }
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