import express ,{ Request, Response, Router } from "express";
import { Login, logout, Register } from "../controller/user.controller";



const router: Router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route('/logout').post(logout)



export default router