import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SIGN } from "@repo/backend-common/config";


export const userMiddleware = (req : Request, res : Response, next : NextFunction) => {
    try {
   const headers = req.headers["authorization"] ?? ''
   const decoded = jwt.verify(headers, JWT_SIGN);
   console.log(decoded)
   if (decoded) {
    req.id = (decoded as JwtPayload).userId;
    console.log("passed")
    next();
  }} catch(e) {
    res.status(200).json({
        message : "Bad request"
    })}
} 