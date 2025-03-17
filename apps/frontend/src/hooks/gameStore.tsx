
import { GAME_RESULT } from "@/utils/constants";
import { Move } from "chess.js";


export interface Player {
  name: string;
  id: string;
  isGuest?: boolean;
}

export interface Game {
  gameId: string;
  moveCount: number;
  game_type: string;
  whitePlayer?: Player;
  blackPlayer?: Player;
  fen?: string;
  moves?: Move[];
  varient?: "",
  status?: string;
  result?: GAME_RESULT;
  timer1?: number;
  timer2?: number;
}

