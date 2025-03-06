import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRETCODE || "your_secret";

export const getUser = (token: string) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, secretKey);
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
  console.log("Payload to be signed:", payload);
  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: "5h",
  });
  return token;
};
