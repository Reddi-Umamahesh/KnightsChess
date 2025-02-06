import jwt from "jsonwebtoken"
import { User } from "../SockerManager"
import WebSocket from "ws"

const code = process.env.SECRETCODE;
export interface jwtUserClaims  {

    name: string,
    email:string,
    userId: string,
    isGuest : boolean 
        
}

export const extractUser = (token: string , ws : WebSocket) => {
    const decoded = jwt.verify(token, code || "secret_key")
    const userClaims = decoded as jwtUserClaims
    return new User(userClaims, ws);
}