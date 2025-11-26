import axios from "axios"
import { HTTP_BACKEND } from "../config"

export async function getExistingShapes(roomId : string){
    const res = await axios.get(`${HTTP_BACKEND}/room/chat/${roomId}`, {
        headers : {
            Authorization : localStorage.getItem("token")
        }
    })
    const messages = res.data.messages

    const shapes = messages.map((x : {message : string})=> {
        const messageData = JSON.parse(x.message)
        return messageData.shape
    })

    return shapes
}