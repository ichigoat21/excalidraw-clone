import z from 'zod'


export const userSchema = z.object({
    username : z.string().max(20).min(3),
    password : z.string().min(4),
    email : z.email()
})

export const roomSchema = z.object({
    name : z.string().max(20).min(3)
})

