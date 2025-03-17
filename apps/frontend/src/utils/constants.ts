import { Move } from "chess.js";

export const getWidth = (width: number) => {
  let w: number = 60;
  if (width < 1200) {
    const drop = Math.floor((1200 - width) / 100);
    w = 60 - drop * 4;
  }
  if (width <= 400) {
    w = 40;
  }
  if (width <= 500 && width >= 400) {
    w = 44;
  }
  if (width <= 900 && width >= 800) {
    w = 56;
  }
  if (width <= 800 && width >= 500) {
    w = 56;
  }
  return {
    SquareWidth: `${w}px`,
    BoardWidth: `${w * 8}px`,
  };
};

export interface BaseUserInterface {
  id: string;
  name: string;
  email?: string | null;
  isGuest: boolean;
}
export interface GuestUser {
  id: string;
  name: string;
  iat: number;
  exp: number;
}
export const guest_api_endpoint = "http://localhost:3000/api/v1/guest";
export const user_api_endpoint = "http://localhost:3000/api/v1/user";
export const api_endpoint = "http://localhost:3000/api/v1";
export const google_auth_endpoint = "http://localhost:3000/auth/google";
export const ws_url = "ws://localhost:8080";

export type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW" | null;
export type GAME_MODE = "RAPID" | "BLITZ" | "BULLET"
export const USER_TOKEN = "user_token";
export const INIT_GAME = "init_game";
export const CREATE_ROOM = "CREATE_ROOM";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_START = "game_start";
export const GAME_ADDED = "game_added";
export const GAME_ENDED = "game_ended";
export const EXIT_GAME = "exit_game";
export const JOIN_ROOM = "JOIN_ROOM";
export const GAME_JOINED = "game_joined";
export const DRAW_OFFER = "draw_offer";
export const DRAW_ACCEPT = "draw_accept";
export const DRAW_REJECT = "draw_reject";
export const TIME_UPDATE = "TIME_UPDATE";
export const inital_Fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
export type Color = "w" | "b";
export type PieceSymbol =
  | "p"
  | "k"
  | "q"
  | "b"
  | "n"
  | "r"
  | "P"
  | "K"
  | "Q"
  | "B"
  | "N"
  | "R";

export interface message {
  gameId: string;
  whitePlayer: BaseUserInterface;
  blackPlayer: BaseUserInterface;
  moves: any[];
  fen: string;
}

export interface Game {
  moveCount: number;
  varient: string;
  whitePlayer: BaseUserInterface;
  blackPlayer: BaseUserInterface;
  moves: Move[];
  status: String;
  result: GAME_RESULT;
  timer1: number;
  timer2: number;
}

//helper function
export const getCookie = (name: string) => {
  console.log("from helper :", name);
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null; // Return the cookie value if found, else null
};

export type VARIENT = "RAPID" | "BLITZ" | "BULLET" | "THREE_CHECK";
export type GAME_STATUS =
  | "PLAYER_EXIT"
  | "GAME_ABANDONDED"
  | "STALEMATE"
  | "IN_PROGRESS"
  | "TIME_OUT"
  | "CHECKMATE"
  | "RESIGNATION";

export interface User {
  id: string;
  name: string;
  socket: WebSocket;
  isGuest: boolean;
}
