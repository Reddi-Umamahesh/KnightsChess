// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
// import express from 'express'
// const passport = require("passport");
// const app = express()
// app.use(passport.initialize());
// app.use(passport.session());

// import { Prisma, PrismaClient, User } from "@prisma/client";

// const prisma = new PrismaClient();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || "your_id",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your_secret",
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log("hi")
//         let user = await prisma.user.findUnique({
//           where: { id: profile.id },
//         });
//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               id: profile.id,
//               Username: profile.displayName,
//               email: profile.emails ? profile.emails[0].value : "",
//             },
//           });
//           console.log(user)
//         }
//         return done(null, user);
//       } catch (error) {
//         return error;
//       }
//     }
//   )
// );

// passport.serializeUser((user: User, done: any) => {
//   done(null, user.id);
// });

// passport.deserialzeUser(async (id: string, done: any) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id: id } });
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });
