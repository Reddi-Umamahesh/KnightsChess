import { WebSocket } from "ws";
import { EXIT_GAME, GAME_ALERT, INIT_GAME, MOVE } from "./messages";
import { Game } from "./game";
import { sockerManager, User } from "./SockerManager";

export class GameManganer {
    
    private games: Game[];
    private pendingUser: User | null;
    private users : WebSocket[]

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }


    addUSer(user: User) {
        this.users.push(user.socket)
        this.addHandler(user)
    }

    removeuser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(user: User) {
        console.log("inside handler")
        user.socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser,  user);
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
                    sockerManager.addUser(user.userId, game.gameId);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = user;
                    
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1.socket === user.socket || game.player2?.socket === user.socket)
                
                if (game) {
                    game.makeMove(user ,message.payload.move)
                }
            }

            if (message.type === EXIT_GAME) {
                const gameId = message.payload.gameId
                const game = this.games.find((g) => g.gameId === gameId)
                if (!game) {
                    console.log("game not found")
                }

                
            }
            
        })
    
    }
}