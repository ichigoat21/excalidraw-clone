"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal, Minus, MousePointer2 } from "lucide-react";
import { Game } from "../draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "line" | "select";

const TOOLS: { id: Tool; icon: React.ReactNode; title: string }[] = [
  { id: "select",  icon: <MousePointer2 size={18} />,       title: "Select (V)"  },
  { id: "pencil",  icon: <Pencil size={18} />,              title: "Pen (P)"     },
  { id: "rect",    icon: <RectangleHorizontal size={18} />, title: "Rectangle (R)"},
  { id: "circle",  icon: <Circle size={18} />,              title: "Circle (C)"  },
  { id: "line",    icon: <Minus size={18} />,               title: "Line (L)"    },
];

const KEY_MAP: Record<string, Tool> = {
  v: "select",
  p: "pencil",
  r: "rect",
  c: "circle",
  l: "line",
};

export default function Canvas({
  roomId,
  socket,
  token,
}: {
  roomId: string;
  socket: WebSocket;
  token: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");

  // Sync tool with game instance
  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  // Init canvas + game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const g = new Game(canvas, roomId, socket, token);
    setGame(g);

    return () => {
      g.destroy();
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const tool = KEY_MAP[e.key.toLowerCase()];
      if (tool) setSelectedTool(tool);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d0d0f]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        style={{ cursor: selectedTool === "select" ? "default" : "crosshair" }}
      />

      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

      {/* Room pill badge */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/30 text-xs font-mono tracking-widest select-none">
        room · {roomId}
      </div>
    </div>
  );
}

function Toolbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div className="fixed top-1/2 left-5 -translate-y-1/2 z-50">
      <div
        className="flex flex-col gap-1 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {TOOLS.map((tool, i) => (
          <div key={tool.id}>
            {/* Subtle divider before "select" group end */}
            {i === 1 && (
              <div className="w-6 h-px bg-white/10 mx-auto mb-1" />
            )}
            <IconButton
              icon={tool.icon}
              title={tool.title}
              onClick={() => setSelectedTool(tool.id)}
              activated={selectedTool === tool.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}