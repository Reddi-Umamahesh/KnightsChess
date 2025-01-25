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
import { sockerManager, User } from "./SockerManager";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { GAME_RESULT, GAME_STATUS, getTime, VARIENT , MOVE } from "./types";
import { isCastling, isPromoting } from "./utils";


export class Game {
  public gameId: string;
  public player1: User;
  public player2: User | null;
  public board: Chess;
  public Turn: 1 | 2 = 1;
  private timer: NodeJS.Timeout | null = null;
  public game_result: GAME_RESULT | null = null;
  private move_count: number = 0;
  private Game_status: GAME_STATUS | null = null;
  private varient: VARIENT = "RAPID";
  private player1_time_consumed = 0;
  private player2_time_consumed = 0;
  private player1_time_left = getTime(this.varient);
  private player2_time_left = getTime(this.varient);
  private startTime: Date = new Date(Date.now());
  static interval: NodeJS.Timeout | null = null;
  private lastMoveTime: Date = new Date(Date.now());

  constructor(player1: User, player2: User | null, gameID?: string , varient: VARIENT = "RAPID" , startTime: Date = new Date(Date.now())) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameID || uuidv4();
    this.board = new Chess();
    this.varient = varient;
    this.startTime = startTime;
    this.lastMoveTime = startTime;
  }

  async updateSecondPlayer(player2: User) {

    this.player2 = player2;
    console.log("game started ,,");
    this.addTodb();
    
    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          gameId: this.gameId,
          whitePlayer: {
            userId: this.player1.userId,
            userName: this.player1.name,
            isGuest : this.player1.isGuest
          },
          blackPlayer: {
            userId: this.player2.userId,
            userName: this.player2.name,
            isGuest : this.player2.isGuest
          },
          fen: this.board.fen(),
          moves: [],
        },
      })
    );
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
        whitePlayerId: this.player1.userId,
        blackPlayerId: this.player2.userId,
      },
    })
    console.log("game", game); 
    } catch (e) {
      console.error(e)
    }
  }

  async saveMovestoDB(move: Move, moveTimeStamp: Date) {
    try {
      await db.$transaction([
      db.move.create({
        data: {
          gameId: this.gameId,
          moveId: uuidv4(),
          from: move.from.toString(),
          to: move.to.toString(),
          piece: move.piece.toString(),
          promotion: move.promotion?.toString() || null,
          moveNumber: this.move_count++,
          captured: move.captured?.toString(),
          timeTaken: moveTimeStamp,
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
      ])
    } catch (e) {
      console.log("error while saving move to db",e)
    }

  }
  async makeMove(user: User, move: Move) {
    //validate the move using zod
    if (this.board.turn() === BLACK && user.userId !== this.player2?.userId) {
      return;
    }
    if (this.board.turn() === WHITE && user.userId !== this.player1.userId) {
      return;
    }
    const moveTimeStamp = new Date(Date.now());
    console.log(
      "inside move",
      this.board.turn(),
      user.userId,
    );
    console.log(this.player1.userId);
    console.log(this.player2?.userId);
    if (this.game_result) {
      return 
    }
    try {
      if(isPromoting(this.board, move.from, move.to)) {
        this.board.move({ from: move.from, to: move.to, promotion: move.promotion })
      } else {
        this.board.move({ from: move.from, to: move.to })
      }
      
    }catch(e) {
      console.log("error while moving", e);
      return;
    }
    
    if (this.Turn === 1) {
      this.sendPlayer2TimeCount();
      this.Turn = 2;
    } else {
      this.sendPlayer1TimeCount();
      this.Turn = 1;
    }
    //already flipped the turn
    if (this.board.turn() === BLACK) {
      this.player1_time_consumed += moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    } else {
      this.player2_time_consumed += moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }
    await this.saveMovestoDB(move, moveTimeStamp);
    this.lastMoveTime = moveTimeStamp;

    const moveMadeBy =
      this.board.turn() === BLACK ? this.player1 : this.player2;
    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: MOVE_MADE,
        payload: {
          move: move,
          player: moveMadeBy,
          turn: this.board.turn(),
          fen: this.board.fen(),
          player1_time_consumed: this.player1_time_consumed,
          player2_time_consumed: this.player2_time_consumed,
        },
      })
    );
    this.resetAbandonTime();
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
      sockerManager.broadcast(
        this.gameId,
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            gameId: this.gameId,
            response,
          },
        })
      );
    }
  }

  sendPlayer1TimeCount() {
    if(Game.interval) {
      clearInterval(Game.interval);
    }
    if (this.player1_time_left > 0) {
      Game.interval = setInterval(() => {
        this.player1_time_left -= 1000;
        sockerManager.broadcast(
          this.gameId,
          JSON.stringify({
            type: "TIME_UPDATE",
            payload: {
              player1Time: this.player1_time_left,
              player2Time: this.player2_time_left,
            },
          })
        );
        if (this.player1_time_left <= 0) {
          //end game
          this.endGame("TIME_OUT", "BLACK_WINS");
          return
        }
      }, 1000);
    } else {
      if(Game.interval) {
        clearInterval(Game.interval);
      }
    }

  }
  sendPlayer2TimeCount() {
    if(Game.interval) {
      clearInterval(Game.interval);
    }
    if (this.player2_time_left > 0) {

      Game.interval = setInterval(() => {
        this.player2_time_left -= 1000;
        sockerManager.broadcast(
          this.gameId,
          JSON.stringify({
            type: "TIME_UPDATE",
            payload: {
              player1Time: this.player1_time_left,
              player2Time: this.player2_time_left,
            },
          })
        );
        if (this.player2_time_left <= 0) {
          //end game
          this.endGame("TIME_OUT", "WHITE_WINS");
          return
        }
      } , 1000)
     
    } else {
      if (Game.interval) {
        clearInterval(Game.interval);
      }
      }
        
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
      user.userId === this.player1.userId ? "BLACK_WINS" : "WHITE_WINS"
    );
  }

  offerDraw(user: User) {
    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: DRAW_OFFER,
        payload: {
          senderUserId: user.userId,
        },
      })
    )
  }

  acceptDraw(user: User) {
    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: DRAW_ACCEPT,
        payload: {
          messege: "Draw Accepted",
        },
      })
    )
    this.endGame("COMPLETED", "DRAW");
  }

  rejectDraw(user: User) {
    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: DRAW_REJECT,
        payload: {
          messege: "Draw Rejected",
        },
      })
    )
  }


  async endGame(gameStatus: GAME_STATUS, result: GAME_RESULT) {
    const updateGame = await db.game.update({
      data: {
        status: gameStatus,
        gameResult: result,
        whitePlayerTimeConsumed: this.player1_time_consumed,
        blackPlayerTimeConsumed: this.player2_time_consumed,
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
    })

    sockerManager.broadcast(
      this.gameId,
      JSON.stringify({
        type: GAME_OVER,
        payload: {
          gameStatus,
          result,
          moves: updateGame.moves,
          whitePlayer: {
            id: updateGame.whitePlayer.userId,
            username: updateGame.whitePlayer.Username,
          },
          blackPlayer: {
            id: updateGame.blackPlayer.userId,
            username: updateGame.blackPlayer.Username,
          },
          startTime: this.startTime,
          endTime: new Date(Date.now()),
          current_fen: this.board.fen(),
          player1TimeConsumed: this.player1_time_consumed,
          player2TimeConsumed: this.player2_time_consumed,
        },
      })
    );
    if (Game.interval) {
      clearInterval(Game.interval);
    }
    
  }

 
}
