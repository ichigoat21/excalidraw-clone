import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/config/config"
import {userSchema} from "@repo/common/z"
import { client } from "@repo/db-package/client";
import bcrypt from "bcrypt"


const userRouter = express.Router();


userRouter.post("/signup", async (req, res)=> {
    try {
        const parsedUser = userSchema.safeParse(req.body)

        if (!parsedUser){
            res.json(403).json({
                message : 'Invalid Inputs'
            })
            return
        }

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        const hashedPassword = await bcrypt.hash(password, 5)
    
        const user = await client.user.create({
            data : {
                username : username,
                password : hashedPassword,
                email : email
            }
        })
        res.status(200).json({
            message : 'You are signed up',
            userId : user.id
        })
    } catch (e){
        res.status(403).json({
            message : 'Sorry Something went wrong'
        })
    }
})


userRouter.post("/signin", async (req, res)=> {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
    
        //db call
        const user = await client.user.findFirst({
            where : {
                email : email
            }
        })
        if(!user){
            res.status(403).json({
                message : "User Not Found"
            })
            return
        }

        const pass = user?.password
        if (typeof(pass)=== "string"){
            res.status(403).json({
                message : 'Bad Request'
            })
            return
        }
        const verified = await bcrypt.compare(pass, password)
        //token

        if(!verified){
            res.status(403).json({
                message : "Bad Request"
            })
            return
        } else {
            const token  = jwt.sign({
                id : user.id
            }, JWT_SECRET)
            
            res.status(200).json({
                message : 'Signed in successfully',
                token : token
            })
        }

        
    } catch (e){
        res.status(403).json({
            message : 'Sorry Something went wrong'
        })
    }
})