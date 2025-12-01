import express from 'express'
import userRouter from './routes/auth'
import roomRouter from './routes/chat'
import { UserMiddleware } from './routes/middleware'
import cors from "cors"


const app = express()

app.use(express.json())
app.use(cors())
app.use("/users", userRouter)
app.use("/room",UserMiddleware, roomRouter)


app.listen(3001, ()=> {
    console.log('Server has Started')
})