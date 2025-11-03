import { JWT_SECRET } from "@repo/config/config";
import {Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export const UserMiddleware = (req : Request, res : Response, next : NextFunction) => {
    try {
    const header = req.headers.authorization
    console.log(header)
    const decoded = jwt.verify(header as string, JWT_SECRET)
    console.log(decoded)
    if (decoded){
        req.id = (decoded as JwtPayload).id
        next()
    }} catch {
        res.status(403).json({
            message : 'Request Failed'
        })
    }
}