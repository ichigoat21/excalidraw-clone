import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface customReq extends Request {
    id : string
}

export const userMiddleware = (req : customReq, res : Response, next : NextFunction) => {
    try {
   const headers = req.headers["Authorization"]
   const decoded = jwt.decode(headers as string);
   if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
    req.id = (decoded as jwt.JwtPayload).id;
    next();
  }} catch(e) {
    res.status(200).json({
        message : "Bad request"
    })}
} 