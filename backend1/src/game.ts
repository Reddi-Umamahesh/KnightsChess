import { WebSocket } from "ws";
import { BLACK, Chess, WHITE } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCnt: 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;

    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCnt = 0;
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: WHITE,
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: BLACK,
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    //validate the move using zod
    if (this.moveCnt % 2 === 0 && socket !== this.player1) {
      console.log("returned 1")
      return;
    }
    if (this.moveCnt % 2 !== 0 && socket !== this.player2) {
      console.log("retured 2")
      return;
    }
    
    console.log("moving.." , move)

    try {
      this.board.move(move);
      this.moveCnt += 1;
      console.log("moved")
      console.log(this.board.ascii())
    } catch (e) {
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "Black" : "White",
          },
        })
      );
      return;
    }

    if (this.moveCnt % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
  }
}
