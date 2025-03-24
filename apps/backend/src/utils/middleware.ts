import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
interface jwtPayload {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
}
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized 1", success: false });
    return;
  }
  console.log(token);
  try {
    const sec = process.env.SECRETCODE || "add_your_secret";
    const decoded = jwt.verify(
      token,
      sec as string
    ) as jwtPayload;
    console.log(decoded, "after decoded");
    let user;
    if (decoded.isGuest === false) {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
    }

    if (!user) {
      res.status(401).json({ message: "User not found", success: false });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: "Invalid or expired token",
      success: false,
    });
    return;
  }
};
