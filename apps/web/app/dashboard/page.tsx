"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Hash, LogOut } from "lucide-react";

export default function Dashboard() {
  const roomRef  = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  const [rooms,    setRooms]    = useState<{ id: any; slug: string }[]>([]);
  const [creating, setCreating] = useState(false);
  const [joining,  setJoining]  = useState(false);
  const [error,    setError]    = useState("");

  async function getRooms() {
    try {
      const res = await axios.get(`${HTTP_BACKEND}/chat/rooms`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      setRooms(res.data.rooms || []);
    } catch {
      // silently fail — rooms just stay empty
    }
  }

  useEffect(() => { getRooms(); }, []);

  async function createRoom() {
    const name = roomRef.current?.value?.trim();
    if (!name) { setError("Please enter a room name."); return; }
    setError("");
    setCreating(true);
    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room/chat`,
        { name },
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );
      router.push(`/canvas/${res.data.roomId}`);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create room.");
    } finally {
      setCreating(false);
    }
  }

  function joinById() {
    const id = inputRef.current?.value?.trim();
    if (!id) { setError("Please enter a room ID."); return; }
    setError("");
    setJoining(true);
    router.push(`/canvas/${id}`);
  }

  function signOut() {
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <div
      className="relative bg-[#0d0d0f] min-h-screen w-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.5s ease both 0.05s; }
        .anim-2 { animation: fadeUp 0.5s ease both 0.15s; }
        .anim-3 { animation: fadeUp 0.5s ease both 0.25s; }
        .anim-4 { animation: fadeUp 0.5s ease both 0.35s; }

        .dash-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .dash-input::placeholder { color: rgba(255,255,255,0.18); }
        .dash-input:focus {
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(12px);
        }

        .btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 10px 16px;
          border-radius: 10px; font-size: 14px; font-weight: 500;
          border: none; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-indigo { background: #6366f1; color: white; }
        .btn-indigo:hover:not(:disabled) {
          background: #818cf8;
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(99,102,241,0.35);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .btn-ghost:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          transform: translateY(-1px);
        }

        .room-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.2s, background 0.2s;
          gap: 12px;
        }
        .room-row:hover {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.25);
        }
        .room-join-btn {
          flex-shrink: 0;
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .room-join-btn:hover {
          background: rgba(99,102,241,0.28);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-700/10 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="anim-1 relative flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7 Q5 2 7 7 Q9 12 12 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="text-white/60 text-sm font-medium tracking-wide">Canvas</span>
        </div>
        <button onClick={signOut} className="flex items-center gap-1.5 text-white/25 hover:text-white/50 text-xs transition-colors"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          <LogOut size={13} />
          sign out
        </button>
      </nav>

      {/* Main */}
      <main className="relative flex flex-col items-center px-5 pt-12 pb-20">
        {/* Header */}
        <div className="anim-2 text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-2">
            Your workspace
          </h1>
          <p className="text-white/30 text-sm">Create a room or jump into an existing one.</p>
        </div>

        <div className="w-full max-w-md flex flex-col gap-4">

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Create room */}
          <div className="anim-2 card">
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              New room
            </p>
            <div className="flex flex-col gap-3">
              <input
                ref={roomRef}
                className="dash-input"
                placeholder="Room name…"
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
              />
              <button onClick={createRoom} disabled={creating} className="btn btn-indigo">
                <Plus size={15} />
                {creating ? "Creating…" : "Create room"}
              </button>
            </div>
          </div>

          {/* Join by ID */}
          <div className="anim-3 card">
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-3"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              Join by ID
            </p>
            <div className="flex flex-col gap-3">
              <input
                ref={inputRef}
                className="dash-input"
                placeholder="Room ID…"
                onKeyDown={(e) => e.key === "Enter" && joinById()}
              />
              <button onClick={joinById} disabled={joining} className="btn btn-ghost">
                <ArrowRight size={15} />
                {joining ? "Joining…" : "Join room"}
              </button>
            </div>
          </div>

          {/* Existing rooms */}
          <div className="anim-4 card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/30 font-medium tracking-widest uppercase"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Your rooms
              </p>
              <span className="text-xs text-white/20 tabular-nums"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {rooms.length}
              </span>
            </div>

            {rooms.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-6">
                No rooms yet — create one above.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {rooms.map((room) => (
                  <div key={room.id} className="room-row">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Hash size={13} className="text-white/20 flex-shrink-0" />
                      <span className="text-white/65 text-sm truncate">{room.slug}</span>
                    </div>
                    <button onClick={() => router.push(`/canvas/${room.id}`)} className="room-join-btn">
                      Join <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}