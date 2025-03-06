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
  private varient: VARIENT = "RAPID";
  private timer: NodeJS.Timeout | null = null;
  private player1_timer = getTime(this.varient);
  private player2_timer = getTime(this.varient);
  private startTime: Date = new Date(Date.now());

  constructor(
    player1: User,
    player2: User,
    gameID?: string,
    varient: VARIENT = "RAPID",
    startTime: Date = new Date(Date.now())
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameID || uuidv4();
    this.board = new Chess();
    this.varient = varient;
    this.startTime = startTime;
  }

  async intiGame() {
    console.log("game started!!");
    console.log(
      "from updatesecond player",
      this.player1.name,
      this.player2.name
    );
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
    console.log("game added", message);
    this.broadcast(JSON.stringify(message));
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
    console.log("inside add to db", this.player1.id, this.player2.id);
    try {
      const game = await db.game.create({
        data: {
          gameId: this.gameId,
          status: "IN_PROGRESS",
          currentFen: this.board.fen(),
          startTime: new Date(),
          whitePlayerId: this.player1.id,
          blackPlayerId: this.player2.id,
        },
      });
      console.log("game", game);
    } catch (e) {
      console.error(e);
    }
  }

  async saveMovestoDB(move: Move) {
    console.log("savinggg to db", move);
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

    console.log("inside makeMove", this.board.turn());
    if (this.board.turn() === BLACK && user.id !== this.player2?.id) {
      return;
    }
    if (this.board.turn() === WHITE && user.id !== this.player1.id) {
      return;
    }
 
    console.log("inside move", this.board.turn(), user.name);

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
      console.log(moveResult);
    } catch (e) {
      console.log("error while moving", e);
      return;
    }

    if (this.board.turn() === 'w') {
      this.sendPlayer1TimeCount();
      this.resetAbandonTime();
    } else {
      this.sendPlayer1TimeCount();
      this.resetAbandonTime();
    }
    
    await this.saveMovestoDB(move);

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
    console.log("move completed");
    this.move_count++;
    // stalemate & three fold repeat
    if (this.board.isGameOver()) {
      const response = this.board.isDraw()
        ? DRAW
        : this.board.turn() === WHITE
          ? BLACK_WINS
          : WHITE_WINS;
      this.game_result = response;
      this.endGame("COMPLETED", response);
      
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
          player2_time: this.player2_timer
        },
      }
      this.broadcast(JSON.stringify(message));
    } , 1000)
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
          player2_time: this.player2_timer
        },
      }
      this.broadcast(JSON.stringify(message));
    } , 1000)
  }

  async resetAbandonTime() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.endGame(
        "GAME_ABANDONDED",
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
          gameId : this.gameId,
          messege: "Draw Accepted",
        },
      })
    );
    this.endGame("COMPLETED", "DRAW");
  }

  rejectDraw() {
    this.broadcast(
      JSON.stringify({
        type: DRAW_REJECT,
        payload: {
          gameId : this.gameId,
          messege: "Draw Rejected",
        },
      })
    );
  }

  async endGame(gameStatus: GAME_STATUS, result: GAME_RESULT) {
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

    this.broadcast(
      JSON.stringify({
        type: GAME_OVER,
        payload: {
          gameId: this.gameId,
          status: gameStatus,
          result: result,
          moves: updateGame.moves,
          whitePlayer: {
            id: updateGame.whitePlayer.id,
            name: updateGame.whitePlayer.name,
          },
          blackPlayer: {
            id: updateGame.blackPlayer.id,
            name: updateGame.blackPlayer.name,
          },
          startTime: this.startTime,
          endTime: new Date(Date.now()),
          current_fen: this.board.fen(),
          player1TimeConsumed: this.player1_timer,
          player2TimeConsumed: this.player2_timer,
        },
      })
    );
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  broadcast(message: string) {
    this.player1.socket.send(JSON.parse(message));
    this.player2.socket.send(JSON.parse(message));
  }
}
