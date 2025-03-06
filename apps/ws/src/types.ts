import { WebSocket } from "ws";

export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";
export type GAME_STATUS =
  | "PLAYER_EXIT"
  | "GAME_ABANDONDED"
  | "STALEMATE"
  | "IN_PROGRESS"
  | "TIME_OUT"
  | "CHECKMATE"
  | "COMPLETED"
  | "RESIGNATION";

  
export type VARIENT = "RAPID" | "BLITZ" | "BULLET" | "THREE_CHECK";

export type GAME_TYPE = "PUBLIC" | "PRIVATE";

export type MOVE = {
  moveId: string;
  gameId: string;
  from: string;
  to: string;
  promotion: string | null;
  captured: string | null;
  timeTaken: Date;
  createdAt: Date;
};

export const getTime = (varient :VARIENT) => {
    switch(varient) {
        case "RAPID":
            return 10 * 60 * 1000;
        case "BLITZ":
            return 5 * 60 * 1000;
        case "BULLET":
            return 2 * 60 * 1000;
        case "THREE_CHECK":
            return 10 * 60 * 1000;
    }
}

export type User = {
    id: string;
    name: string;
    socket: WebSocket;
    isGuest: boolean;
}
