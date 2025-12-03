import { roomSchema } from "@repo/common/z";
import express, { Router } from "express"
import { client } from "@repo/db-package/client";

const roomRouter : Router = express.Router()



roomRouter.get("/rooms", async (req, res)=> {
    try {
        const userId = (req as any).id
        console.log(userId)
        if (typeof userId !== "string") {
            res.status(403).json({
                message : 'Sorry something went wrong'
            })
            return;
          }
        const rooms = await client.room.findMany({
            where : {
                adminId : userId
            }
        }) 
        res.status(200).json({
            rooms : rooms
        })
    } catch {
        res.status(411).json({
            message : 'Error Finding Chats'
        })
    }
})


roomRouter.post("/chat", async (req, res)=> {
    try {
        const parsedData = roomSchema.safeParse(req.body)

        if (!parsedData.success){
            res.status(403).json({
                message : 'Invalid Inputs'
            })
            return
        }
        const userId = req.id
    
        if (typeof userId !== "string") {
            res.status(403).json({
                message : 'Sorry something went wrong'
            })
            return;
          }
    
        const room = await client.room.create({
            data : {
                slug : parsedData.data.name,
                adminId : userId
            }
        })
    
        res.status(200).json({
            message : 'Succesfully joined the room',
            roomId : room.id
        })
    } catch {
        res.status(411).json({
            message : 'Error Creating Chat'
        })
    }
    
})

roomRouter.get("/chat/:id", async (req, res) => {
    try {
      const roomId = Number(req.params.id);
      const messages = await client.chat.findMany({
        where : {
            roomId : roomId
        }, orderBy : {
            id : "desc",
        }, take : 50
      })

      res.status(200).json({
        messages
      })
    } catch (e){
        res.status(411).json({
            message : 'Error Finding chats'
        })
    }
})

export default roomRouter