import { WebSocket } from "ws";
import { BLACK, Chess, Move, Square, WHITE } from "chess.js";
import {
  BLACK_WINS,
  DRAW,
  DRAW_ACCEPT,
  DRAW_OFFER,
  DRAW_REJECT,
  GAME_OVER,
  GAME_TIME_MS,
  INIT_GAME,
  MOVE_MADE,
  WHITE_WINS,
} from "./messages";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { GAME_RESULT, GAME_STATUS, getTime, VARIENT, MOVE, User } from "./types";
import { isCastling, isPromoting } from "./utils";

export class Game {
  public gameId: string;
  public player1: User;
  public player2: User;
  public board: Chess;
  public game_result: GAME_RESULT | null = null;
  private move_count: number = 0;
  private Game_status: GAME_STATUS | null = null;
  private varient: VARIENT;
  private timer: NodeJS.Timeout | null = null;
  private abandonTimer:NodeJS.Timeout | null = null
  private player1_timer = 0;
  private player2_timer = 0;
  private startTime: Date = new Date(Date.now());

  constructor(
    player1: User,
    player2: User,
    varient: VARIENT,
    gameID?: string,
    startTime: Date = new Date(Date.now())
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameID || uuidv4();
    this.board = new Chess();
    this.varient = varient;
    this.startTime = startTime;
    this.player1_timer = getTime(this.varient);
    this.player2_timer = getTime(this.varient);
  }

  async intiGame() {

    this.addTodb();
    const message = {
      type: INIT_GAME,
      payload: {
        gameId: this.gameId,
        varient: this.varient,
        whitePlayer: {
          id: this.player1.id,
          name: this.player1.name,
          isGuest: this.player1.isGuest,
        },
        blackPlayer: {
          id: this.player2.id,
          name: this.player2.name,
          isGuest: this.player2.isGuest,
        },
        fen: this.board.fen(),
        moves: [],
        player1_time: this.player1_timer,
        player2_time: this.player2_timer,
      },
    };
    this.broadcast(JSON.stringify(message));
    this.resetAbandonTime();
    if (this.board.turn() === "w") {
      this.sendPlayer1TimeCount();
    } else {
      this.sendPlayer2TimeCount();
    }
  }
  updatePlayer1(User: User) {
    this.player1 = User;
  }
  updatePlayer2(User: User) {
    this.player2 = User;
  }
  async addTodb() {
    if (!this.player2) {
      return;
    }
    try {
      const game = await db.game.create({
        data: {
          gameId: this.gameId,
          status: "IN_PROGRESS",
          currentFen: this.board.fen(),
          startTime: new Date(),
          whitePlayerId: this.player1.id,
          blackPlayerId: this.player2.id,
          moves: { create: [] },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async saveMovestoDB(move: Move) {

    try {
      await db.$transaction([
        db.move.create({
          data: {
            gameId: this.gameId,
            moveId: uuidv4(),
            from: move.from.toString(),
            to: move.to.toString(),
            piece: move.piece?.toString(),
            promotion: move.promotion?.toString() || null,
            moveNumber: this.move_count++,
            captured: move.captured?.toString(),
            timeTaken: new Date(),
            createdAt: new Date(),
          },
        }),
        db.game.update({
          where: {
            gameId: this.gameId,
          },
          data: {
            currentFen: this.board.fen(),
          },
        }),
      ]);
    } catch (e) {
      console.log("error while saving move to db", e);
    }
  }
  async makeMove(user: User, move: Move) {

    if (this.board.turn() === BLACK && user.id !== this.player2?.id) {
      return;
    }
    if (this.board.turn() === WHITE && user.id !== this.player1.id) {
      return;
    }
    if (this.game_result) {
      return;
    }
    let moveResult: Move | null = null;
    try {
      if (isPromoting(this.board, move.from, move.to)) {
        moveResult = this.board.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      } else {
        moveResult = this.board.move({ from: move.from, to: move.to });
      }
    } catch (e) {
      console.log("error while moving", e);
      return;
    }
    this.resetAbandonTime();
    if (this.board.turn() === "w") {
      this.sendPlayer1TimeCount();
    } else {
      this.sendPlayer2TimeCount();
    }

    

    const moveMadeBy =
      this.board.turn() === BLACK ? this.player1 : this.player2;

    this.broadcast(
      JSON.stringify({
        type: MOVE_MADE,
        payload: {
          gameId: this.gameId,
          move: move,
          player: moveMadeBy,
          turn: this.board.turn(),
          fen: this.board.fen(),
          player1_time_consumed: this.player1_timer,
          player2_time_consumed: this.player2_timer,
        },
      })
    );
    await this.saveMovestoDB(move);
    this.move_count++;
    if (this.board.isGameOver()) {
      let response:GAME_RESULT = "DRAW"
      let reason:GAME_STATUS = "CHECKMATE"
      if (this.board.isCheckmate()) {
        response = this.board.turn() === WHITE ? BLACK_WINS : WHITE_WINS;
        reason = "CHECKMATE"
      } else if (this.board.isStalemate()) {
        response = DRAW;
        reason = "STALEMATE"
      }else {
        response = DRAW
        reason = "DRAW"
      }  
      console.log(response);
      this.game_result = response;
      this.endGame(reason, response);
    }
  }

  sendPlayer1TimeCount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.player1_timer -= 1000;
      if (this.player1_timer <= 0) {
        this.endGame("TIME_OUT", "BLACK_WINS");
        return;
      }
      const message = {
        type: "TIME_UPDATE",
        payload: {
          gameId: this.gameId,
          player1_time: this.player1_timer,
          player2_time: this.player2_timer,
        },
      };
      this.broadcast(JSON.stringify(message));
    }, 1000);
  }
  sendPlayer2TimeCount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.player2_timer -= 1000;
      if (this.player2_timer <= 0) {
        this.endGame("TIME_OUT", "WHITE_WINS");
        return;
      }
      const message = {
        type: "TIME_UPDATE",
        payload: {
          gameId: this.gameId,
          player1_time: this.player1_timer,
          player2_time: this.player2_timer,
        },
      };
      this.broadcast(JSON.stringify(message));
    }, 1000);
  }

  async resetAbandonTime() {
    if (this.abandonTimer) {
      clearTimeout(this.abandonTimer);
    }

    this.abandonTimer = setTimeout(() => {
      console.log("ending game")
      this.endGame(
        "PLAYER_EXIT",
        this.board.turn() === BLACK ? "WHITE_WINS" : "BLACK_WINS"
      );
    }, 90 * 1000);
  }

  exitGame(user: User) {
    this.endGame(
      "PLAYER_EXIT",
      user.id === this.player1.id ? "BLACK_WINS" : "WHITE_WINS"
    );
  }
  resignGame(user: User) {
    this.endGame(
      "RESIGNATION",
      user.id === this.player1.id ? "BLACK_WINS" : "WHITE_WINS"
    );
  }

  offerDraw(user: User) {
    this.broadcast(
      JSON.stringify({
        type: DRAW_OFFER,
        payload: {
          gameId: this.gameId,
          senderId: user.id,
        },
      })
    );
  }

  acceptDraw() {
    this.broadcast(
      JSON.stringify({
        type: DRAW_ACCEPT,
        payload: {
          gameId: this.gameId,
          messege: "Draw Accepted",
        },
      })
    );
    this.endGame("DRAW", "DRAW");
  }

  rejectDraw() {
    this.broadcast(
      JSON.stringify({
        type: DRAW_REJECT,
        payload: {
          gameId: this.gameId,
          messege: "Draw Rejected",
        },
      })
    );
  }

  async endGame(gameStatus: GAME_STATUS, result: GAME_RESULT) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    

    this.broadcast(
      JSON.stringify({
        type: GAME_OVER,
        payload: {
          gameId: this.gameId,
          status: gameStatus,
          result: result,
          whitePlayer: {
            id: this.player1.id,
            name: this.player1.name,
          },
          blackPlayer: {
            id: this.player2.id,
            name: this.player2.name,
          },
          startTime: this.startTime,
          endTime: new Date(Date.now()),
          current_fen: this.board.fen(),
          player1TimeConsumed: this.player1_timer,
          player2TimeConsumed: this.player2_timer,
        },
      })
    );
    const updateGame = await db.game.update({
      data: {
        status: gameStatus,
        gameResult: result,
        whitePlayerTimeConsumed: this.player1_timer,
        blackPlayerTimeConsumed: this.player2_timer,
      },
      where: {
        gameId: this.gameId,
      },
      include: {
        moves: {
          orderBy: {
            moveNumber: "asc",
          },
        },
        blackPlayer: true,
        whitePlayer: true,
      },
    });
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  broadcast(message: string) {
    try {
      if (this.player1.socket.readyState === WebSocket.OPEN) {
        this.player1.socket.send(message);
      }
      if (this.player2.socket.readyState === WebSocket.OPEN) {
        this.player2.socket.send(message);
      }
    } catch (error) {
      console.error("Error broadcasting message:", error);
    }
  }
}
