
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
  status?: string;
  result?: string | null;
  timer1?: number;
  timer2?: number;
}

