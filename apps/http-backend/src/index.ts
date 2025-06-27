import express from "express"
import userRouter from "./routes/auth";
import { userMiddleware } from "./middlware";
import chatRouter from "./routes/chat";


const app = express();


app.use(express.json());
app.use("/users", userRouter)
app.use("/chat", userMiddleware, chatRouter)


app.listen(3000, ()=> {console.log("listening")})