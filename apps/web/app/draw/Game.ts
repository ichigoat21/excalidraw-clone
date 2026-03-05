import { getExistingShapes } from "./http";

export type Tool = "circle" | "rect" | "pencil" | "line" | "select";

type Shape =
  | { type: "rect";   x: number; y: number; width: number; height: number }
  | { type: "circle"; x: number; y: number; radius: number }
  | { type: "line";   x1: number; y1: number; x2: number; y2: number }
  | { type: "pencil"; points: { x: number; y: number }[] };

const STROKE = "rgba(255,255,255,0.85)";
const BG     = "#0d0d0f";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX: number;
  private startY: number;
  private selectedTool: Tool;
  private pencilPoints: { x: number; y: number }[];
  socket: WebSocket;
  private token: string;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, token: string) {
    this.canvas        = canvas;
    this.ctx           = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId        = roomId;
    this.clicked       = false;
    this.socket        = socket;
    this.token         = token;
    this.selectedTool  = "pencil";
    this.startX        = 0;
    this.startY        = 0;
    this.pencilPoints  = [];
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup",   this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId, this.token);
    this.clearCanvas();
  }

  clearCanvas() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = BG;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = STROKE;
    this.ctx.lineWidth   = 1.5;
    this.ctx.lineCap     = "round";
    this.ctx.lineJoin    = "round";

    for (const shape of this.existingShapes) {
      this.drawShape(shape);
    }
  }

  private drawShape(shape: Shape) {
    this.ctx.strokeStyle = STROKE;
    this.ctx.lineWidth   = 1.5;
    this.ctx.lineCap     = "round";
    this.ctx.lineJoin    = "round";

    if (shape.type === "rect") {
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();

    } else if (shape.type === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.x1, shape.y1);
      this.ctx.lineTo(shape.x2, shape.y2);
      this.ctx.stroke();
      this.ctx.closePath();

    } else if (shape.type === "pencil") {
      const pts = shape.points;
      if (pts.length < 2) return;
      this.ctx.beginPath();
      pts.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsed = JSON.parse(message.message);
        if (parsed.shape) {
          this.existingShapes.push(parsed.shape);
          this.clearCanvas();
        }
      }
    };
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX  = e.offsetX;
    this.startY  = e.offsetY;

    if (this.selectedTool === "pencil") {
      this.pencilPoints = [{ x: e.offsetX, y: e.offsetY }];
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const tool = this.selectedTool;
    if (tool === "select") return;

    let shape: Shape | null = null;

    if (tool === "pencil") {
      if (this.pencilPoints.length < 2) return;
      shape = { type: "pencil", points: [...this.pencilPoints] };
      this.pencilPoints = [];

    } else if (tool === "rect") {
      shape = {
        type:   "rect",
        x:      this.startX,
        y:      this.startY,
        width:  e.offsetX - this.startX,
        height: e.offsetY - this.startY,
      };

    } else if (tool === "circle") {
      const dx     = e.offsetX - this.startX;
      const dy     = e.offsetY - this.startY;
      const radius = Math.sqrt(dx * dx + dy * dy) / 2;
      shape = {
        type:   "circle",
        x:      this.startX + dx / 2,
        y:      this.startY + dy / 2,
        radius,
      };

    } else if (tool === "line") {
      shape = {
        type: "line",
        x1: this.startX,
        y1: this.startY,
        x2: e.offsetX,
        y2: e.offsetY,
      };
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.clearCanvas();
    this.socket.send(JSON.stringify({
      type:    "chat",
      message: JSON.stringify({ shape }),
      roomId:  this.roomId,
    }));
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked) return;

    const tool = this.selectedTool;
    if (tool === "select") return;

    if (tool === "pencil") {
      const x    = e.offsetX;
      const y    = e.offsetY;
      const last = this.pencilPoints[this.pencilPoints.length - 1];
      if (last) {
        this.pencilPoints.push({ x, y });
        // Draw only the new segment on top — no full redraw needed for perf
        this.ctx.strokeStyle = STROKE;
        this.ctx.lineWidth   = 1.5;
        this.ctx.lineCap     = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      return;
    }

    // Preview shape while dragging
    this.clearCanvas();
    const dx = e.offsetX - this.startX;
    const dy = e.offsetY - this.startY;

    this.ctx.strokeStyle = STROKE;
    this.ctx.lineWidth   = 1.5;

    if (tool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, dx, dy);

    } else if (tool === "circle") {
      const radius  = Math.sqrt(dx * dx + dy * dy) / 2;
      const centerX = this.startX + dx / 2;
      const centerY = this.startY + dy / 2;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();

    } else if (tool === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup",   this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}