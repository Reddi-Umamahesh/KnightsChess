
import { PrismaClient, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
const secretKey = process.env.SECRETCODE || "your_secret";
 

export const getUser = (token:string) => {
    try {
        if (!token) return null
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        return null;
    }

}

export const setUser = (user:User) => {
    const payload =  {
        id : user.userId,
        email : user.email,
        username : user.Username
    }
    const token = jwt.sign(payload, secretKey);
    return token
}