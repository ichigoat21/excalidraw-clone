import { getExistingShapes } from "./http";

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


export class Game {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D
    private existingShape : Shape[];
    private roomId : string
    private clicked : boolean
    private startX : number
    private startY : number
    socket : WebSocket

    constructor (canvas : HTMLCanvasElement, roomId : string){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!
        this.existingShape = []
        this.roomId = roomId
        this.clicked = false
        this.startX = 0
        this.startY = 0
        this.init()
        this.initHandlers()
    }

    async init(){
        this.existingShape = await getExistingShapes(this.roomId)


    }

    initHandlers(){
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShape.push(parsedShape.shape);
                this.clearCanvas();
              }
        }
    
    }
    initMouseHandlers(){
        this.canvas.addEventListener("mousedown", (e)=> {
            this.clicked = true
            this.startX = e.clientX;
            this.startY = e.clientY;
        })


        this.canvas.addEventListener("mouseup", (e)=> {
            if (!this.clicked) return;
            this.clicked = false;
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            //@ts-ignore
           const selectedTool = window.selectedTool
           let shape : Shape | null = null
           if (selectedTool === "rect"){
           shape =  { type: "rect", 
           x: this.startX, 
           y: this.startY, 
           width, 
           height 
            }} else if (selectedTool === "circle"){
            const radius = Math.sqrt(width * width + height * height) / 2;
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
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

          this.existingShape.push(shape);
          this.clearCanvas();
          this.socket.send(
          JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId: this.roomId
          }));
        })
        this.canvas.addEventListener("mousemove", (e)=> {
            this.clearCanvas();
            if (!this.clicked) return;
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            //@ts-ignore
            const selectedTool = window.selectedTool;
            if (selectedTool === "rect") {
              this.ctx.strokeRect(this.startX, this.startY, width, height);   
          } else if (selectedTool === "circle") {
              const radius = Math.max(width, height) / 2;
              const centerX = this.startX + width / 2;
              const centerY = this.startY + height / 2;
              this.ctx.beginPath();
              this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.closePath();                
          }
        })
    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
        this.existingShape.map((shape)=> {
            if (shape.type === "rect"){
                this.ctx.strokeStyle = "rgba(255, 255, 255)"  
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            } else if (shape.type === "circle"){
              this.ctx.beginPath();
              this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
              this.ctx.stroke()
              this.ctx.closePath()
            }
        })
    }
    }

