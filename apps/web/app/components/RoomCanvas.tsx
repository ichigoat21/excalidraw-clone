"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import Canvas from "./Canvas";

type Status = "loading-token" | "connecting" | "ready" | "error";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>("loading-token");
  const [errorMsg, setErrorMsg] = useState("");

  // Read token from localStorage (client-only)
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      setErrorMsg("No auth token found. Please sign in.");
      setStatus("error");
      return;
    }
    setToken(t);
    setStatus("connecting");
  }, []);

  // Connect WebSocket once token is available
  useEffect(() => {
    if (!token) return;

    let ws: WebSocket;

    try {
      ws = new WebSocket(`${WS_URL}?token=${token}`);
    } catch (e) {
      setErrorMsg("Failed to connect to server.");
      setStatus("error");
      return;
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", roomId }));
      setSocket(ws);
      setStatus("ready");
    };

    ws.onerror = () => {
      setErrorMsg("WebSocket connection error.");
      setStatus("error");
    };

    ws.onclose = (e) => {
      if (e.code !== 1000) {
        setSocket(null);
        setStatus("error");
        setErrorMsg("Connection closed unexpectedly.");
      }
    };

    return () => {
      ws.close(1000, "component unmount");
      setSocket(null);
    };
  }, [token, roomId]);

  if (status === "ready" && socket && token) {
    return <Canvas socket={socket} roomId={roomId} token={token} />;
  }

  return <SplashScreen status={status} message={errorMsg} />;
}

function SplashScreen({
  status,
  message,
}: {
  status: Status;
  message?: string;
}) {
  const isError = status === "error";

  return (
    <div className="fixed inset-0 bg-[#0d0d0f] flex flex-col items-center justify-center gap-4">
      {/* Ambient glow */}
      <div className="absolute w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {isError ? (
        <>
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-lg font-bold">
            !
          </div>
          <p className="text-white/40 text-sm font-mono">{message}</p>
        </>
      ) : (
        <>
          <Spinner />
          <p className="text-white/30 text-xs font-mono tracking-widest uppercase animate-pulse">
            {status === "loading-token" ? "Authenticating" : "Connecting"}
          </p>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-indigo-400 animate-spin" />
  );
}