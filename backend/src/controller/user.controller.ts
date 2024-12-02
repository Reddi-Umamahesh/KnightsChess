import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { setUser } from "../utils/auth";
const prisma = new PrismaClient();

export const Register = async(req: Request, res: Response) => {
    
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        console.log(username , email , password)
        res.status(400).json({ message: "Please fill in all fields", success: false });
        return 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                userId : uuidv4(),
                Username: username,
                email,
                password: hashedPassword,
            }
        })
        console.log(user)
        const token = setUser(user);
        res.status(201).send({
            message: "User created successfully",
            success: true,
            token
        })
        return 
    } catch (e) {
        res.status(400).json({ message: "Username or email already exists", success: false })
        return
    }
} 
export const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            message: "Please fill in all fields", success: false
        });
    }
    try {
        const user = await prisma.user.findUnique
            ({ where: { email } });
        if (!user) {
            res.status(400).json({
                message: "Invalid email or password", success: false
            });
            return
        }
        const pwd = user.password|| ""
        const isValidPassword = await bcrypt.compare(password, pwd);
        if (!isValidPassword) {
            res.status(400).json({
                message: "Invalid email or password", success: false
            })
        }
        const token = setUser(user)
        res.status(200).json({
            message: "Login successful",
            success: true,
            token 
        })
        return

    } catch (e) {
        res.status(400).json({
            message: "User not found", success: false
        });
        return 
    }
}
