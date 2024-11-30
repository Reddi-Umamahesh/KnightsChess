import express ,{ Request, Response, Router } from "express";
import { Login, Register } from "../controller/user.controller";



const router: Router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login)

export default router