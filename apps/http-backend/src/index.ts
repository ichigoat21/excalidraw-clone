import express from 'express'
import userRouter from './routes/auth'
import roomRouter from './routes/chat'
import { UserMiddleware } from './routes/middleware'
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())
app.use("/users", userRouter)
app.use("/room", UserMiddleware, roomRouter)

const PORT = 3001
const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`

// Self-ping: hits /health every 14 minutes to prevent free-tier spin-down
app.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: Date.now() })
})

setInterval(async () => {
  try {
    const res = await fetch(`${SELF_URL}/health`)
    console.log(`[self-ping] ${new Date().toISOString()} → ${res.status}`)
  } catch (err) {
    console.error("[self-ping] failed:", err)
  }
}, 14 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})