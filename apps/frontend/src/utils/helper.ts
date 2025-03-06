import { Chess, Square } from "chess.js";

export const isPromoting = (board: Chess, from: Square, to: Square) => {
  if (!from || !to) return false;
  const piece = board.get(from);
  if (!piece || piece.type !== "p") return false;

  if (piece.color !== board.turn()) return false;

  const promotionRanks = piece.color === "w" ? "8" : "1";

  if (!to.endsWith(promotionRanks)) return false;
  const validMoves = board.moves({ square: from, verbose: true });
  return validMoves.some((move) => move.to === to);
};