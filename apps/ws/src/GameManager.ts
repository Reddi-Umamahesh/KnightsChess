import { WebSocket } from "ws";
import { EXIT_GAME, GAME_ADDED, GAME_ALERT, INIT_GAME, MOVE } from "./messages";
import { Game } from "./game";
import { sockerManager, User } from "./SockerManager";

export class GameManganer {
    
    private games: Game[];
    private pendingUser: User | null;
    private users : User[]

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }


    addUSer(user: User) {
        this.users.push(user)
        this.addHandler(user)
    }

    removeuser(socket: WebSocket) {
        const user = this.users.find((u) => u.socket === socket);
        if (!user) {
            console.log("No user found");
            return
        }
        this.users = this.users.filter((u) => u.socket !== user.socket);

        sockerManager.removeUser(user.userId);

    }

    removeGame(gameId: string) {
        this.games = this.games.filter((game) => game.gameId !== gameId);
    }

    private addHandler(user: User) {
        console.log("inside handler")
        user.socket.on("message", async(data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                console.log("pendinguser")
                if (this.pendingUser) {
                    const game = this.games.find((g) => g.player1.userId === this.pendingUser?.userId)
                    if (!game) {
                        console.log("game not found", this.pendingUser.userId )
                        return
                    }; 
                    console.log("pendinguser present");
                    if (this.pendingUser.userId === user.userId) {
                        sockerManager.broadcast(
                          game.gameId,
                          JSON.stringify({
                            type: GAME_ALERT,
                            message:
                              "You can't play with yourself .  Please wait for another player.",
                          })
                        );
                        return 
                    }
                    console.log("adding 2nd player")
                    
                    sockerManager.addUser(user ,  game.gameId);
                    this.games.push(game);
                    await game.updateSecondPlayer(user)
                    this.pendingUser = null;
                } else {
                    this.pendingUser = user;
                    const game = new Game(user, null)
                    sockerManager.addUser(user ,  game.gameId);
                    this.games.push(game);
                    console.log(
                      this.pendingUser.userId,
                      user.userId,
                      this.games[0].Game_result,
                      this.games[0].player1.userId,
                      this.games[0].player2?.userId
                    );
                    console.log("waiting for player2");
                    sockerManager.broadcast(game.gameId, JSON.stringify({
                        type: GAME_ADDED,
                        payload: {
                            gameId: game.gameId,
                            message : "waiting for player2"
                        }
                    }))
                    
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1.socket === user.socket || game.player2?.socket === user.socket)
                if (!game) {
                    console.log("game not found")
                    return 
                }
                
                game.makeMove(user, message.payload.move)
                if (game.Game_result) {
                    this.removeGame(game.gameId)
                }
            
            }

            if (message.type === EXIT_GAME) {
                const gameId = message.payload.gameId
                const game = this.games.find((g) => g.gameId === gameId)
                if (!game) {
                    console.log("game not found")
                    return
                }
                game.exitGame(user);
                this.removeGame(game.gameId)
                
            }
            
        })
    
    }
}