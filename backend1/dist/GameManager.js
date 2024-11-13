"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManganer = void 0;
const messages_1 = require("./messages");
const game_1 = require("./game");
class GameManganer {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUSer(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeuser(socket) {
        this.users = this.users.filter(user => user !== socket);
        //stop the game here because user left
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message);
                }
            }
        });
    }
}
exports.GameManganer = GameManganer;
