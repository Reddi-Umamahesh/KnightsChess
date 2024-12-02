import { Request, Response } from "express";

export const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" , success:false })
}