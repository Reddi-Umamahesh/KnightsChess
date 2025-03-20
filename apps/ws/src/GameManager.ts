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

import { User, VARIENT } from "./types";

export class GameManganer {

  private games: Map<string, Game>;
  private rooms: Map<String, [User , VARIENT]>;
  private pendingUserRapid: User | null;
  private pendingUserBlitz: User | null;
  private pendingUserBullet: User | null;
  private users: User[];

  constructor() {
    this.games = new Map();
    this.users = [];
    this.pendingUserRapid = null;
    this.pendingUserBlitz = null;
    this.pendingUserBullet = null;
    this.rooms = new Map();
  }

  addUSer(user: User) {
    this.users.push(user);
    this.updateUser(user);
    this.addHandler(user);
  }
  updateUser(user: User) {
    this.games.forEach((game, id) => {
      if (game.player1.id === user.id) {
        game.updatePlayer1(user)
      } else if (game.player2.id === user.id) {
        game.updatePlayer2(user)
      }
    })
  }
  removeuser(socket: WebSocket) {
    const user = this.users.find((u) => u.socket === socket);
    if (!user) {
      // console.log("No user found");
      return;
    }
    this.users = this.users.filter((u) => u.socket !== user.socket);


  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === INIT_GAME) {
        const { varient } = message;

        let pendingUser: User | null = null;

        if (varient === "RAPID") {
          pendingUser = this.pendingUserRapid;
        } else if (varient === "BULLET") {
          pendingUser = this.pendingUserBullet;
        } else if (varient === "BLITZ") {
          pendingUser = this.pendingUserBlitz;
        }
        if (pendingUser) {
        
          if (pendingUser.id === user.id) {
            if (varient === "RAPID") {
              this.pendingUserRapid = user;
            } else if (varient === "BULLET") {
              this.pendingUserBullet = user;
            } else if (varient === "BLITZ") {
              this.pendingUserBlitz = user;
            }
            user.socket.send(
              JSON.stringify({
                type: GAME_ADDED,
                payload: {
                  message: `waiting for player2 | invite your friend using gameId for ${varient} variant`,
                },
              })
            );
            return;
          }
          const game = new Game(pendingUser, user, varient);
          
          this.games.set(game.gameId, game);
          await game.intiGame();

          if (varient === "RAPID") {
            this.pendingUserRapid = null;
          } else if (varient === "BULLET") {
            this.pendingUserBullet = null;
          } else if (varient === "BLITZ") {
            this.pendingUserBlitz = null;
          }
        } else {
          // console.log(`waiting for player2 (${varient})`, user.id);
          if (varient === "RAPID") {
            this.pendingUserRapid = user;
          } else if (varient === "BULLET") {
            this.pendingUserBullet = user;
          } else if (varient === "BLITZ") {
            this.pendingUserBlitz = user;
          }

          user.socket.send(
            JSON.stringify({
              type: GAME_ADDED,
              payload: {
                message: `waiting for player2 | invite your friend using gameId for ${varient} variant`,
              },
            })
          );
        }
      }

      if (message.type === MOVE_MADE) {
        const game = this.games.get(message.payload.gameId);
        if (!game) {
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
          return;
        }
        game.exitGame(user);
        this.removeGame(game.gameId);
      }
      if (message.type === "RESIGNATION") {
        const game = this.games.get(message.gameId);
        if (!game) {
 
          return;
        }
        game.resignGame(user);
        this.removeGame(game.gameId);
      }
      if (message.type == DRAW_OFFER) {
        const game = this.games.get(message.gameId);
        if (!game) {
        
          return;
        }
        game.offerDraw(user);
      }
      
      if (message.type === DRAW_ACCEPT) {
        const game = this.games.get(message.gameId);
        if (!game) {
        
          return;
        }
        game.acceptDraw();
      }
      if (message.type === DRAW_REJECT) {
        const game = this.games.get(message.gameId);
        if (!game) {
         
          return;
        }
        game.rejectDraw();
      }
      if (message.type === "CREATE_ROOM") {
        const varient = message.varient || "RAPID";
        function generateRandomNumber(): string {
          return String(Math.floor(Math.random() * 999) + 1)
        }
        let number = generateRandomNumber();
        while (this.rooms.has(number)) {
          number = generateRandomNumber();
        }
        this.rooms.set(number , [user , varient])
        setTimeout(() => {
          if (this.rooms.has(number)) {
            this.rooms.delete(number);
            
          }
        }, 2 * 600000); 
        user.socket.send(
          JSON.stringify({
            type: GAME_ADDED,
            payload: {
              message: `Room created successfully! Your room ID is: ${number}`,
            },
          })
        );

      }
      if (message.type === "JOIN_ROOM") {
        const roomId = message.roomId;
        if (!this.rooms.has(roomId)) {
          user.socket.send(
            JSON.stringify({
              type: GAME_ALERT,
              message: "room not found , please create one!",
            })
          );
          return;
        }
        const roomData = this.rooms.get(roomId)
        if (!roomData) {
          user.socket.send(
            JSON.stringify({
              type: GAME_ALERT,
              message: "room not found",
            })
          );
          return;
        }
        const player1: User = roomData[0];
        const varient:VARIENT = roomData[1]
        if (player1.id === user.id) {
          user.socket.send(
            JSON.stringify({
              type: GAME_ADDED,
              payload: {
                message: `waiting for player2 | invite your friend using gameId for ${roomId} roomId`,
              },
            })
          );
          return;
        }

        const game = new Game(player1, user , varient);
        this.games.set(game.gameId, game);
        await game.intiGame();
        this.rooms.delete(roomId)
      }
    });
    
  }
}
