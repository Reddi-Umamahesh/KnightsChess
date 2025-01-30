import express , { Request, Response, Router } from "express";
import { isAuthenticated } from "../utils/middleware";



const router: Router = express.Router();

router.get(
  "/check-auth",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      // req.user should be populated by your isAuthenticated middleware
      res.status(200).json({
        isAuthenticated: true,
        user: req.user,
      });
    } catch (error) {
      res.status(401).json({ isAuthenticated: false });
    }
  }
);
export default router