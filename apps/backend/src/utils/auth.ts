import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const getUser = (token: string) => {
  try {
    if (!token) return null;
    const secretKey = process.env.SECRETCODE ;
    const decoded = jwt.verify(token, secretKey || "add_your_secret");
    return decoded;
  } catch (error) {
    return null;
  }
};

export const setUser = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    isGuest: user.isGuest,
  };
  const secretKey = process.env.SECRETCODE;
  const token = jwt.sign(payload, secretKey || "add_your_secret", {
    algorithm: "HS256",
    expiresIn: "5h",
  });
  return token;
};
