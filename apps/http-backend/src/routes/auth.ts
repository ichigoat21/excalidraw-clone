import express from "express"
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/config/config"
import {userSchema} from "@repo/common/z"
import { client } from "@repo/db-package/client";
import bcrypt from "bcrypt"


const userRouter = express.Router();




userRouter.post("/signup", async (req, res)=> {
    try {

        await client.$connect()
        console.log(" DB Connected")

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
        console.log(user)
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


userRouter.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // find user
      const user = await client.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        return res.status(403).json({ message: "User Not Found" });
      }
  
      const hashedPassword = user.password;
  
      // compare plain password with hashed one
      const verified = await bcrypt.compare(password, hashedPassword);
  
      if (!verified) {
        return res.status(403).json({
          message: "Invalid Credentials"
        });
      }
  
      // create token
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
  
      return res.status(200).json({
        message: "Signed in successfully",
        token
      });
  
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
  

export default userRouter