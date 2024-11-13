"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCnt = 0;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: chess_js_1.WHITE,
            },
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: chess_js_1.BLACK,
            },
        }));
    }
    makeMove(socket, move) {
        //validate the move using zod
        if (this.moveCnt % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCnt % 2 !== 0 && socket !== this.player2) {
            return;
        }
        this.moveCnt += 1;
        try {
            this.board.move(move);
        }
        catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "Black" : "White",
                },
            }));
            return;
        }
        if (this.moveCnt % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move,
            }));
        }
    }
}
exports.Game = Game;
