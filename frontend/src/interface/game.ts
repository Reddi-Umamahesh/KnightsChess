
export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS = "PLAYER_EXIT" | 'GAME_ABANDONDED' | "STALEMATE" | 'IN_PROGRESS' | 'TIME_OUT' | 'CHECKMATE' | "RESIGNATION";

export interface User{
    userId: string;
   name: string;
   socket: WebSocket;
   isGuest: boolean;
}