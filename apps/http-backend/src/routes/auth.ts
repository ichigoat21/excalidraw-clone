import express, { Router } from "express"
import jwt from "jsonwebtoken"
import {prisma} from "@repo/db-package/client"
import {userSchema} from "@repo/common/types"
import bcrypt from "bcrypt"
import {JWT_SIGN} from "@repo/backend-common/config"

const userRouter : Router = express.Router()


userRouter.post("/signup", async (req, res)=> {
    const parsedData = userSchema.safeParse(req.body)
    if (!parsedData.success){    
        res.status(400).json({
            message : "bad request"
        })
        return
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 5);
    try {
        const user = await prisma.user.create({
            data : {
                name : parsedData.data.username,
                password : hashedPassword,   
                email : parsedData.data.email
            }
        } )
        res.json({
            userId : user.id
        })
       } catch(e) {
            res.status(411).json({
                message : "User already exists"
            })
        }
    
    })

userRouter.post("/signin", async (req, res)=> {
    const parsedData = userSchema.safeParse(req.body)
    const email = parsedData.data?.email
    
    const user = await prisma.user.findFirst({
        where : {email}
    })
    

    if (!user) {
         res.status(404).json({ error: "User not found" });
         return;
      }
    if (typeof(parsedData.data?.password) !== "string" ){
        res.status(411).json({
            message : "something went wrong"
        })
        return ;
    }
    const decoded = await bcrypt.compare(parsedData.data?.password, user.password)
    if (decoded) {
        const token = jwt.sign({
            userId : user.id
        }, JWT_SIGN)
    
        res.status(200).json({
            token,
            message : "Signed Up"
        }
    )
    } else {
        res.status(403).json({
            message : "Bad Request"
        })
    }
}
)

export default userRouter