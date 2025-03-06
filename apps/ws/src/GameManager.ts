import { WebSocket } from "ws";
import {
  DRAW_ACCEPT,
  DRAW_OFFER,
  DRAW_REJECT,
  EXIT_GAME,
  GAME_ADDED,
  GAME_ALERT,
  GAME_ENDED,
  INIT_GAME,
  MOVE_MADE,
} from "./messages";
import { Game } from "./game";

import { db } from "./db";
import { User } from "./types";

export class GameManganer {

  private games: Map<string, Game>;
  private pendingUser: User | null;
  private users: User[];

  constructor() {
    this.games = new Map();
    this.users = [];
    this.pendingUser = null;
  }

  addUSer(user: User) {
    this.users.push(user);
    this.addHandler(user);
    console.log("user added" )
  }

  removeuser(socket: WebSocket) {
    const user = this.users.find((u) => u.socket === socket);
    if (!user) {
      console.log("No user found");
      return;
    }
    this.users = this.users.filter((u) => u.socket !== user.socket);


  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  private addHandler(user: User) {
    console.log("adding handler");
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          console.log("pendinguser present");
          if (this.pendingUser.id === user.id) {
            user.socket.send(
              JSON.stringify({
                type: GAME_ALERT,
                message:
                "You can't play with yourself .  Please wait for another player.",
              })
            )
            return;
          }
          const game = new Game(this.pendingUser, user);
          console.log("adding 2nd player");
          this.games.set(game.gameId, game);
          await game.intiGame();
          this.pendingUser = null;
        } else {
          this.pendingUser = user;
          console.log(
            "waiting for player2",
            this.pendingUser.id,
            user.id,
          );
          user.socket.send(
            JSON.stringify({
              type: GAME_ADDED,
              payload: {
                message: "waiting for player2 | invite your friend using gameId",
              },
            })
          ); 
        }
      }

      if (message.type === MOVE_MADE) {
        const game = this.games.get(message.gameId);
        if (!game) {
          console.log("game not found");
          return;
        }
        game.makeMove(user, message.payload.move);
        if (game.game_result) {
          this.removeGame(game.gameId);
        }
      }

      if (message.type === EXIT_GAME) {
        const game = this.games.get(message.gameId);
        if (!game) {
          console.log("game not found");
          return;
        }
        game.exitGame(user);
        this.removeGame(game.gameId);
      }

      if (message.type == DRAW_OFFER) {
        const game = this.games.get(message.gameId);
        if (!game) {
          console.log("game not found");
          return;
        }
        game.offerDraw(user);
      }
      if (message.type === DRAW_ACCEPT) {
        const game = this.games.get(message.gameId);
        if (!game) {
          console.log("game not found");
          return;
        }
        game.acceptDraw();
      }
      if (message.type === DRAW_REJECT) {
        const game = this.games.get(message.gameId);
        if (!game) {
          console.log("game not found");
          return;
        }
        game.rejectDraw();
      }

      if (message.type === "JOIN_ROOM") {
        const gameId = message.payload.gameId;
        
        const game = this.games.get(message.gameId);
        if (!game || gameId ) {
          console.log("game not found");
          return;
        }
        if (user.id === game?.player1.id) {
          game.updatePlayer1(user);
        }
        if (user.id === game?.player2?.id) {
          game.updatePlayer2(user);
        }

        const gameFromDB = await db.game.findUnique({
          where: {
            gameId: gameId,
          },
          include: {
            moves: {
              orderBy: {
                moveNumber: "asc",
              },
            },
            whitePlayer: true,
            blackPlayer: true,
          },
        });


        if (!gameFromDB) {
          user.socket.send(
            JSON.stringify({
              type: GAME_ALERT,
              message: "Game not found",
            })
          );
          return;
        }
        if (gameFromDB.status === "IN_PROGRESS") {
          user.socket.send(
            JSON.stringify({
              type: "IN_PROGRESS",
              payload: {
                gameId: gameFromDB.gameId,
                status: gameFromDB.status,
                currentFen: gameFromDB.currentFen,
                moves: gameFromDB.moves,
                player1: {
                  id: gameFromDB.whitePlayer.id,
                  name: gameFromDB.whitePlayer.name,
                },
                player2: {
                  id: gameFromDB.blackPlayer.id,
                  name: gameFromDB.blackPlayer.name,
                },
                player1_time_consumed:
                  gameFromDB.whitePlayerTimeConsumed,
                player2_time_consumed:
                  gameFromDB.blackPlayerTimeConsumed,
              },
            })
          );
        }
        if (gameFromDB.status !== "IN_PROGRESS") {
          user.socket.send(
            JSON.stringify({
              type: GAME_ENDED,
              payload: {
                gameId: gameFromDB.gameId,
                result: gameFromDB.gameResult,
                status: gameFromDB.status,
                currentFen: gameFromDB.currentFen,
                moves: gameFromDB.moves,
                player1: {
                  id: gameFromDB.whitePlayer.id,
                  name: gameFromDB.whitePlayer.name,
                },
                player2: {
                  id: gameFromDB.blackPlayer.id,
                  name: gameFromDB.blackPlayer.name,
                },
                player1_time_consumed: gameFromDB.whitePlayerTimeConsumed,
                player2_time_consumed: gameFromDB.blackPlayerTimeConsumed,
              },
            })
          );
          return;
        }
      }
    });
    
  }
}
