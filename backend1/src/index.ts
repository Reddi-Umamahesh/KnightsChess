import { WebSocketServer } from "ws";
import { GameManganer } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManganer();
wss.on("connection", function connection(ws) {
  gameManager.addUSer(ws);
 ws.on("disconnect" , () => gameManager.removeuser(ws))
});
