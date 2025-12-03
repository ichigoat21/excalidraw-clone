import { JWT_SECRET } from "@repo/config/config";
import {Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export const UserMiddleware = (req : Request, res : Response, next : NextFunction) => {
    try {
    const header = req.headers.authorization
    const decoded = jwt.verify(header as string, JWT_SECRET)
    if (decoded){
        (req as any).id = (decoded as JwtPayload).id
        next()
    }} catch {
        res.status(403).json({
            message : 'Request Failed'
        })
    }
}