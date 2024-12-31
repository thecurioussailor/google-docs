import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export function authMiddleware( req: Request, res: Response, next: NextFunction){
    const header = req.headers.authorization;
    const jwtToken = header?.split(" ")[1];

    if(!jwtToken){
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    try{
        console.log("jwtToken", jwtToken);
        console.log("jwtSECRET", JWT_SECRET);
        const decoded = jwt.verify(jwtToken, JWT_SECRET || "secret") as { userId: string};
        console.log("in side authMiddleware", decoded);
        req.userId = decoded.userId;
        next();
    }catch(e){
        res.status(401).json({
            message: "Invalid token"
        })
    }

}