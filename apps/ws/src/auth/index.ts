import jwt from "jsonwebtoken";

import WebSocket from "ws";
import { User } from "../types";

const code = process.env.SECRETCODE;
export interface jwtUserClaims {
  name: string;
  email: string;
  id: string;
  isGuest: boolean;
}

export const extractUser = (token: string, ws: WebSocket) => {
  try {
    const decoded = jwt.verify(token, code || "add_your_secret");
   
    const userClaims = decoded as jwtUserClaims;

    const user: User = {
      id: userClaims.id,
      name: userClaims.name,
      socket: ws,
      isGuest: userClaims.isGuest,
    };
    return user;
  } catch (e) {
    // console.log("error in extracting user" , e);
  }
};
