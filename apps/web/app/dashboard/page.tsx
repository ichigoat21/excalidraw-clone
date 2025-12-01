"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const roomRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [rooms, setRooms] = useState<{ id: any; slug: string }[]>([]);

  async function getRooms() {
    const response = await axios.get(`${HTTP_BACKEND}/chat/rooms`, {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    });
    setRooms(response.data.rooms || []);
  }

  useEffect(() => {
    getRooms();
  }, []);

  async function joinRoom() {
    const room = roomRef.current?.value;
    const response = await axios.post(
      `${HTTP_BACKEND}/room/chat`,
      { name: room },
      { headers: { Authorization: localStorage.getItem("token") || "" } }
    );
    router.push(`/canvas/${response.data.roomId}`);
  }

  function getRoom() {
    const id = inputRef.current?.value;
    if (id) router.push(`/canvas/${id}`);
  }

  function join(id: any) {
    router.push(`/canvas/${id}`);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 md:p-6 bg-neutral-950 text-white">
      <div className="flex flex-col gap-6 w-full max-w-lg md:max-w-2xl">
        {/* Create Room */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-4">
          <div className="space-y-1">
            <Label>Room Name</Label>
            <Input
              ref={roomRef}
              placeholder="Enter room name..."
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <Button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Create Room
          </Button>
        </div>

        {/* Join Room */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-4">
          <div className="space-y-1">
            <Label>Join Room</Label>
            <Input
              ref={inputRef}
              placeholder="Enter Room ID..."
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <Button
            onClick={getRoom}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Join Room
          </Button>
        </div>

        {/* Your Rooms Section */}
        <div className="p-4 md:p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Your Rooms</h2>
          <div className="flex flex-col gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-neutral-800 rounded-lg border border-neutral-700"
              >
                <div className="break-all sm:break-normal">{room.slug}</div>
                <Button
                  onClick={() => join(room.id)}
                  className="mt-2 sm:mt-0 bg-purple-600 hover:bg-purple-700"
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
