import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
import cors from "cors";
import guestRoute from './routes/guest.route'
import userRoute from './routes/User.route'
import googleRouter from './auth'
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
const app = express()
const port = 3000

const session = require('express-session');
import { Prisma, PrismaClient, User } from '@prisma/client'
import { error } from "console";
import { isAuthenticated } from "./utils/middleware";
app.use(express.json())

app.use(express.urlencoded({ extended: true }))


const prisma = new PrismaClient();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
};


app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRETCODE,
    resave: false , 
    saveUninitialized : true
  })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(

  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "your_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your_secret",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("hi");
        let user = await prisma.user.findUnique({
          where: { userId: profile.id },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              userId: profile.id,
              Username: profile.displayName,
              email: profile.emails ? profile.emails[0].value : "",
            },
          });
          console.log(user);
        }
        return done(null, user);
      } catch (error) {
        return error;
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user);
});

passport.deserializeUser(async (id: any, done: any) => {
  try {
    console.log(id)
    const user = await prisma.user.findUnique({ where: { userId: id.userId } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});



app.listen(port, () => {
    console.log("app is listening")
})


app.use("/api/v1/guest" , guestRoute)
app.use("/api/v1/User" , userRoute )
app.use("/auth", googleRouter);

// app.get("/profile", isAuthenticated, (req: Request, res: Response) => {
//   res.json(req.user);
// });

