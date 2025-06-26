import express, { Router } from "express"
import jwt from "jsonwebtoken"
import {prisma} from "@repo/db-package/client"
import {userSchema} from "@repo/common/types"


const userRouter : Router = express.Router()


userRouter.post("/signup", async (req, res)=> {
    const parsedData = userSchema.safeParse(req.body)
    if (!parsedData.success){    
        res.status(400).json({
            message : "bad request"
        })
        return
    }
    try {
        const user = await prisma.user.create({
            data : {
                name : parsedData.data.username,
                password : parsedData.data.password,    
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

// userRouter.post("/signin", async (req, res)=> {
//     const username = req.body.username;
//     const password = req.body.password;
//     try {
//     const user = await prisma.user.findOne({
//         data : {
//             username : username,
//             password : password
//         }
//     })
//     if (user){
//     const token = jwt.sign({
//         id : user.id
//     }, JWT_SIGN)

//     res.status(200).json({
//         token,
//         message : "Signed Up"
//     })}} 
//     catch {
//     res.status(400).json({
//         message : "bad request"
//     })
//     }}

// )

export default userRouter