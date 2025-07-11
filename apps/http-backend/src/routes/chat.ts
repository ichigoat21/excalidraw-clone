import express, { Router } from "express"
import { roomSchema } from "@repo/common/types"
import { prisma } from "@repo/db-package/client";

const chatRouter = express.Router()


chatRouter.post("/room", async (req, res) => {
      const parsedData = roomSchema.safeParse(req.body);
      if (!parsedData.success){
          res.status(403).json({
            message : "Bad Authorization"
          })
          return;
      }
      const userId = req.id 
      console.log(userId)
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return 
      }
      const room = await prisma.room.create({
        data : {
            slug : parsedData.data?.name,
            adminId : userId
        }
      })
      res.status(200).json({
        room : room.id
      })
} )

chatRouter.get("/chat/:roomId", async (req, res)=> {
    const roomId = Number(req.params.roomId);
    const messages = await prisma.chat.findMany({
      where : {
        roomId : roomId
      }, orderBy : {
        id : "desc"
      }, take : 1000
    })
    res.json({
      messages
    })
})

export default chatRouter