import express, { Request, Response, Router } from "express";
import { createGuestUser } from "../controller/guestUser.controller";


const router: Router = express.Router();

router.route("/createGuest").get(createGuestUser)
export default router