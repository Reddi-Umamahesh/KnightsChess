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
  if (!req.url) {
    // console.log("url not found")
    return 
  }
  console.log("connected");
  const ur = url.parse(req.url, true).query.token;
  if (typeof ur != "string") {
    return 
  }
  const token: string = ur
  const user = extractUser(token, ws);
  if (!user) {
    // console.log("user not found");
    ws.close();
    return;
  }
  console.log("User extracted:", user.name);
  gameManager.addUSer(user);
  ws.on("close", () => {
    console.log("User disconnected");
    gameManager.removeuser(ws)
  });
});
