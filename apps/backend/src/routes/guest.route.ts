import express, { Request, Response, Router } from "express";
import { generateJWT } from "../utils/jwtUtils";


const router: Router = express.Router();

router.route("/create-guest").get((req: Request, res: Response) => {
    try {
        const token = generateJWT();
    res.status(200).json({
        success: true,
        token: token
    })
    } catch (e:any) {
        res.status(500).json({ success: false, message: e.message });

    }
    return 
})
export default router