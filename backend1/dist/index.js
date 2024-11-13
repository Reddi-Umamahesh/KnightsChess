"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws) {
    const gameManager = new GameManager_1.GameManganer();
    ws.on("connection", function connection() {
        gameManager.addUSer(ws);
    });
    ws.on("disconnect", () => gameManager.removeuser(ws));
});
