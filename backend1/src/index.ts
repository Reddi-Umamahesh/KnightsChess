import { WebSocketServer } from "ws";
import { GameManganer } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  const gameManager = new GameManganer();

  ws.on("connection", function connection() {
    gameManager.addUSer(ws)

  });

 ws.on("disconnect" , () => gameManager.removeuser(ws))
});
