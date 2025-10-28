import { roomSchema } from "@repo/common/z";
import express from "express"
import { client } from "@repo/db-package/client";

const roomRouter = express.Router()


roomRouter.post("/chat", async (req, res)=> {
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
})