"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRef } from "react"
import axios from "axios"
import { HTTP_BACKEND } from "../config"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function dashboard(){
    const roomRef = useRef<HTMLInputElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    async function joinRoom() {
        const room = roomRef.current?.value
        const response = axios.post(`${HTTP_BACKEND}/room/chat`, {
            name : room
        }, {
            headers : {
                Authorization : localStorage.getItem("token")
            }
        } )
        const roomId = (await response).data.roomId
        router.push(`/canvas/${roomId}`)
    }
    async function getRoom(){
        const id = inputRef.current?.value
        router.push(`/canvas/${id}`)
    }
    return  <div className="h-screen w-screen flex flex-col items-center justify-center gap-10 ">
               <div className=" grid gap-1">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input ref={roomRef} id="room-name" />
                  <Button onClick={joinRoom}>Create</Button>
              </div>
              <div className=" grid gap-1">
                  <Label htmlFor="room-name">Join Room</Label>
                  <Input ref={inputRef} id="room-name" placeholder="Enter Room Id...." />
                  <Button onClick={getRoom}>Enter</Button>
              </div>
            </div>
}