import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./game";

export class GameManganer {
    
    private games: Game[];

    private pendingUser: WebSocket | null;
    private users : WebSocket[]

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }


    addUSer(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeuser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        //stop the game here because user left

    }

    private addHandler(socket: WebSocket) {
        console.log("inside handler")
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                
                if (this.pendingUser) {
                    
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    
                    this.pendingUser = socket;

                }
            }
           
            if (message.type === MOVE) {
                console.log("inside moveee")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket)
                console.log("inside move")
                if (game) {
                    console.log("g")
                    game.makeMove(socket ,message.move)
                }
            }
            
        })
    
    }
}