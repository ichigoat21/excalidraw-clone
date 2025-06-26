import express, { Router } from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import {JWT_SIGN} from "@repo/backend-common/config"
import { userSchema } from "@repo/common/types"

const userRouter : Router = express.Router()
const prisma = new PrismaClient()

userRouter.post("/signup", async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
     
    const user = await prisma.user.create({
        data : {
            username : username,
            password : password
        }
    })
    const token = jwt.sign({
        id : user.id
    }, JWT_SIGN)

    res.status(200).json({
        token,
        message : "Signed Up"
    })}
)

userRouter.post("/signin", async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    try {
    const user = await prisma.user.findOne({
        data : {
            username : username,
            password : password
        }
    })
    if (user){
    const token = jwt.sign({
        id : user.id
    }, JWT_SIGN)

    res.status(200).json({
        token,
        message : "Signed Up"
    })}} 
    catch {
    res.status(400).json({
        message : "bad request"
    })
    }}

)

export default userRouter