import {z} from "zod"

export const userSchema = z.object({
    username : z.string().max(20).min(3),
    password : z.string().max(10)
})

export const roomSchema = z.object({
    name :  z.string().max(20).min(3),
})