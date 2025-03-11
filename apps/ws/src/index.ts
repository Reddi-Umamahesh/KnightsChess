import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer } from "ws";
import { GameManganer } from "./GameManager";
import { extractUser } from "./auth";
import jwt from "jsonwebtoken";
import url from "url";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManganer();
wss.on("connection", function connection(ws, req) {
  console.log("started" , req.headers);
  //@ts-ignore
  const token: string = url.parse(req.url, true).query.token;
  const user = extractUser(token, ws);
  console.log(user.name ,ws.readyState);
  if (!user) {
    console.log("user not found");
    ws.close();
    return;
  }
  console.log("User extracted:", user.name);
  gameManager.addUSer(user);
  ws.on("close", () => gameManager.removeuser(ws));
});
