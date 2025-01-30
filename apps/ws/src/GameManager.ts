import { WebSocket } from "ws";
import { DRAW_ACCEPT, DRAW_OFFER, DRAW_REJECT, EXIT_GAME, GAME_ADDED, GAME_ALERT, GAME_ENDED, INIT_GAME, MOVE_MADE } from "./messages";
import { Game } from "./game";
import { sockerManager, User } from "./SockerManager";
import { db } from "./db";

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
                      this.games[0].game_result,
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

            if (message.type === MOVE_MADE) {
                const game = this.games.find((g) => g.gameId === message.payload.gameId)
                if (!game) {
                    console.log("game not found")
                    return 
                }
                
                game.makeMove(user, message.payload.move)
                if (game.game_result) {
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
            
            if (message.type == DRAW_OFFER) {
                const gameId = message.payload.gameId
                const game = this.games.find((g) => g.gameId === gameId)
                if (!game) {
                    console.log("game not found")
                    return
                }
                game.offerDraw(user);
            }
            if (message.type === DRAW_ACCEPT) {
                const gameId = message.payload.gameId;
                const game = this.games.find((g) => g.gameId === gameId);
                if (!game) {
                    console.log("game not found");
                    return;
                }
                game.acceptDraw();
            }
            if (message.type === DRAW_REJECT) {
                const gameId = message.payload.gameId;
                const game = this.games.find((g) => g.gameId === gameId);
                if (!game) {
                    console.log("game not found");
                    return;
                }
                game.rejectDraw();
            }

            if (message.type === "JOIN_ROOM") {
                const gameId = message.payload.gameId;
                if(!gameId) {
                    console.log("gameId not found");
                    return
                }
                let game = this.games.find((g) => g.gameId === gameId);
                const gameFromDB = await db.game.findUnique({
                    where: {
                        gameId: gameId
                    },
                    include: {
                        moves: {
                            orderBy: {
                                moveNumber: "asc"
                            }
                        },
                        whitePlayer: true,
                        blackPlayer: true
                    }
                });

                if (game && !game.player2) {
                    game.player2 = user;
                    sockerManager.addUser(user, game.gameId);
                    await game.updateSecondPlayer(user);
                    return
                }

                if (!gameFromDB) {
                    user.socket.send(JSON.stringify({
                        type: GAME_ALERT,
                        message: "Game not found"
                    }));
                    return 
                }

                if(gameFromDB.status !== "IN_PROGRESS") {
                    user.socket.send(JSON.stringify({
                        type: GAME_ENDED,
                        payload: {
                            result: gameFromDB.gameResult,
                            status: gameFromDB.status,
                            currentFen: gameFromDB.currentFen,
                            moves: gameFromDB.moves,
                            whitePlayer: {
                                id: gameFromDB.whitePlayer.userId,
                                username : gameFromDB.whitePlayer.Username
                            } ,
                            blackPlayer: {
                                id: gameFromDB.blackPlayer.userId,
                                username : gameFromDB.blackPlayer.Username
                            },
                            player1_time_consumed: gameFromDB.whitePlayerTimeConsumed,
                            player2_time_consumed: gameFromDB.blackPlayerTimeConsumed

                        }
                    }));
                    return
                }

            }

        })
    
    }
}