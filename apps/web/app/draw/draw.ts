import axios from "axios";
import { HTTP_BACKEND } from "../config";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  } | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
  };




  export async function initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    let existingShape: Shape[] = await getExistingShapes(roomId);
    clearCanvas(existingShape, canvas, ctx);
  
    let clicked = false;
    let startX = 0;
    let startY = 0;
  
    const handleMouseDown = (e: MouseEvent) => {
      clicked = true;
      startX = e.clientX;
      startY = e.clientY;
    };
  
    const handleMouseUp = (e: MouseEvent) => {
      if (!clicked) return;
      clicked = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      //@ts-ignore
      const selectedTool = window.selectedTool
      let shape : Shape | null = null
      if (selectedTool === "rect"){
        shape =  { type: "rect", 
          x: startX, 
          y: startY, 
          width, 
          height 
        };
      } else if (selectedTool === "circle"){
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        shape = {
          type : "circle",
          radius : radius,
          x : centerX,
          y : centerY
        }
      }

      if(!shape){
        return
      }

      existingShape.push(shape);
      clearCanvas(existingShape, canvas, ctx);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        })
      );
    };
  
    const handleMouseMove = (e: MouseEvent) => {
      clearCanvas(existingShape, canvas, ctx);
      if (!clicked) return;
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      ctx.strokeStyle = "rgba(255, 255, 255)";
      //@ts-ignore
      const selectedTool = window.selectedTool;
      if (selectedTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);   
    } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();                
    }
    };
  
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        existingShape.push(parsedShape.shape);
        clearCanvas(existingShape, canvas, ctx);
      }
    };
  
    socket.addEventListener("message", handleMessage);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      socket.removeEventListener("message", handleMessage);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }
  

function clearCanvas(existingShape : Shape[], canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    existingShape.map((shape)=> {
        if (shape.type === "rect"){
            ctx.strokeStyle = "rgba(255, 255, 255)"  
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle"){
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.closePath()
        }
    })
}

async function getExistingShapes(roomId : string){
    const res = await axios.get(`${HTTP_BACKEND}/room/chat/${roomId}`, {
        headers : {
            Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5MzQ4NjAwLWJhNjMtNDkyZS04ZWMyLWI1YzYyMjdjZDEzNyIsImlhdCI6MTc2MjA5ODEzM30.Hd5Vfzjo16cygc1Lrfa9kSNiHZJsO7HRD7-_wD-llY4"
        }
    })
    const messages = res.data.messages

    const shapes = messages.map((x : {message : string})=> {
        const messageData = JSON.parse(x.message)
        return messageData.shape
    })

    return shapes
}