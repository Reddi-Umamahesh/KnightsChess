import { WebSocket } from "ws";
import {  BLACK, Chess, Move, Square, WHITE } from "chess.js";
import { DRAW, GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { sockerManager, User } from "./SockerManager";
import { v4 as uuidv4 } from "uuid";
type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
type GAME_STATUS = "PLAYER_EXIT" | 'GAME_ABANDONDED' | "STALEMATE" | 'IN_PROGRESS' | 'TIME_OUT' | 'CHECKMATE' | "RESIGNATION";
export function isPromoting(chess: Chess, from: Square, to: Square) {

  const piece = chess.get(from)
  if (piece.type !== 'p') return 
  if (piece.color !== chess.turn()) return

  if (!["1", "8"].some((ele) => to.endsWith(ele))) return false
  
  return chess.moves({square : from , verbose : true}).some((move) => move.to === to)
  
}
export class Game {
  public gameId: string;
  public player1: User;
  public player2: User | null;
  public board: Chess;
  private timer: NodeJS.Timeout | null = null;
  private move_time: NodeJS.Timeout | null = null;
  private Game_result: GAME_RESULT | null = null;
  private Game_status: GAME_STATUS | null = null;
  private player1_time = 0;
  private player2_time = 0;
  private startTime: Date = new Date(Date.now());
  private lastMoveTime : Date = new Date(Date.now())
 

  constructor(player1: User, player2: User | null , gameID?:string) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameId = gameID || uuidv4();
    this.board = new Chess();
    
  }

  async updateSecondPlayer(player2: User) {
    
    this.player2 = player2
    console.log("game started");
    sockerManager.broadcast(this.gameId, JSON.stringify({
      type: INIT_GAME,
      payload: {
        gameId: this.gameId,
        whitePlayer: this.player1,
        blackPlayer: this.player2,
        fen: this.board.fen(),
        moves : []
      }
    }))
  }

  makeMove(
    user: User,
    move: Move
  ) {
    //validate the move using zod
    if (this.board.turn() === BLACK && user.socket !== this.player1.socket) return;
    
    if (this.board.turn() ===  WHITE  && user.socket !== this.player2?.socket) return;
    
    const moveTimeStamp = new Date(Date.now())
    
    try {
      console.log("moving..", move)
      if (isPromoting(this.board, move.from, move.to)) {
        this.board.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion
        })
      } else {
        this.board.move({
          from: move.from,
          to: move.to
        })
      }
      console.log("move made")
    } catch (e) {
      console.log("error while moving" , e)
      return;
    }

    if (this.board.turn() === BLACK) {
      this.player1_time += moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    } else {
      this.player2_time += moveTimeStamp.getTime() - this.lastMoveTime.getTime();
    }

    this.lastMoveTime = moveTimeStamp

    const moveMadeBy = this.board.turn() === BLACK ? this.player1 : this.player2
    sockerManager.broadcast(this.gameId, JSON.stringify({
      type: MOVE,
      payload: {
        gameId: this.gameId,
        move, 
        moveMadeBy,
        player1TimeConsumed: this.player1_time,
        player2TimeConsumed: this.player2_time
      }
    }))

   
    
    // stalemate & three fold repeat
    if (this.board.isGameOver()) {
      //this.board.isThreefoldRepetition() || this.board.isStalemate() || this.board.isDraw()
      const response = this.board.isDraw() ? DRAW : this.board.turn() === WHITE ? BLACK : WHITE

      sockerManager.broadcast(this.gameId, JSON.stringify({
        type: GAME_OVER,
        payload: {
          gameId: this.gameId,
          response
        }
      }))
      
    }
    
  }

  getPlayer1TimeConsumed() {
    if (this.player1_time) {
      return (
        this.player1_time + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime())
      )
    }
    return this.player1_time
  }
  getPlayer2TimeConsumed() {
    if (this.player2_time) {
      return (
        this.player2_time + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime()
        )
      )
    }
    return this.player2_time
  }
  exitGame() {

  }
}
