import axios from "axios";
import { HTTP_BACKEND } from "../config/config";
import { json } from "stream/consumers";

type Shape = {
    type : "rect";
    x : number,
    y : number,
    width : number,
    height : number
} | {
    type : "circle",
    x : number,
    y : number,
    radius : number
}




export async function initDraw(canvas : HTMLCanvasElement, roomId : string, socket : WebSocket){
    const ctx = canvas.getContext("2d")
    let existingShapes : Shape[] = await getExistingShapes(roomId);
    if (!ctx){
        return;
    }

    ctx.fillStyle =  "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    clearCanvas(existingShapes, canvas, ctx);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type == "chat"){
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape)
            clearCanvas(existingShapes, canvas, ctx)
        }
    }
    

    let clicked = false;
    let startX = 0;
    let startY = 0;
      
    canvas.addEventListener("mousedown" ,(e) => {
        clicked = true
        startX = e.clientX;
        startY = e.clientY
    })
    canvas.addEventListener("mouseup", (e)=> {
        clicked = false
        const shape : Shape = {
            type : "rect",
            x : startX,
            y : startY,
            width : e.clientX - startX,
            height : e.clientY - startY
        }
        existingShapes.push(shape)
        socket.send(JSON.stringify({
            shape
        }))
    })
    canvas.addEventListener("mousemove", (e) => {
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx)
            ctx.strokeStyle =  "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height)
        }
    } )

}


function clearCanvas(existingShape : Shape[], canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D){
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.fillStyle = "rgba(0, 0, 0)";
         ctx.fillRect(0, 0, canvas.width, canvas.height)

         existingShape.map((shape)=> {
            if (shape.type === "rect"){
                ctx.strokeStyle = "rgba(255,255,255)"
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            }
         })
}

async function getExistingShapes(roomId : string){
         const response = await axios.get(`${HTTP_BACKEND}/chat/${roomId}`)
         const messages = response.data.message;

         const shapes = messages.map((shape : {message : string}) => {
            const messageData = JSON.parse(shape.message)
            return messageData;
         })
         return shapes
}