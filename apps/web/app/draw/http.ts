import axios from "axios"
import { HTTP_BACKEND } from "../config"

export async function getExistingShapes(roomId : string){
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