import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors";
import guestRoute from './routes/guest.route'
import userRoute from './routes/User.route'

const app = express()
const port = 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
};


app.use(cors(corsOptions));

app.listen(port, () => {
    console.log("app is listening")
})

app.use("/api/v1/guest" , guestRoute)
app.use("/api/v1/User" , userRoute )
