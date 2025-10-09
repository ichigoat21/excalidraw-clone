import express from "express"
import jwt from "jsonwebtoken"


const userRouter = express.Router();


userRouter.post("/signup", async (req, res)=> {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
    
        //db call
    
    
        res.status(200).json({
            message : 'You are signed up'
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
        const user = "db-call"

        //token
        if(user){
           
        }
    
        res.status(200).json({
            message : 'You are signed in'
        })
    } catch (e){
        res.status(403).json({
            message : 'Sorry Something went wrong'
        })
    }
})