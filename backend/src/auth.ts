import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();
const app = express()
app.use(passport.initialize());
app.use(passport.session());

router.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/profile"); 
  }
);

export default router
