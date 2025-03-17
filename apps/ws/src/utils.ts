import { Chess, Square } from "chess.js";


export const isPromoting = (board: Chess, from: Square, to: Square) => {
    if (!from || !to) return false;
    const piece = board.get(from);
    if (!piece || piece.type !== 'p') return false;

    if (piece.color !== board.turn()) return false;

    const promotionRanks = piece.color === "w" ? "8" : "1";

    if (!to.endsWith(promotionRanks)) return false;
    const validMoves = board.moves({ square: from, verbose: true });
    return validMoves.some((move) => move.to === to);

}

export const isCastling = (board: Chess, from: Square, to: Square) => {
    if (!from || !to) return false;
    const piece = board.get(from);
    if (!piece || piece.type !== 'k') return false;

    if (piece.color !== board.turn()) return false;

    if (from !== 'e1' && from !== 'e8') return false;
    
    const promotionRank = piece.color === "w" ? "1" : "8";

    //king-side castling
    if(to === "g1" || to === "g8") {
        const rook = board.get(piece.color === "w" ? "h1" : "h8");
        if (!rook || rook.type !== "r" && rook.color !== piece.color) return false;

        if((piece.color === "w" && board.get("f1") !== null && board.get('g1') !== null) || (piece.color === "b" && board.get('f8') !== null && board.get('g8') !== null)) return false;
        
        if (!board.getCastlingRights(piece.color).k) return false;

        if (board.isCheck() || board.isAttacked("f1" , 'b') || board.isAttacked('g1' ,'b') || board.isAttacked('f8' , 'w') || board.isAttacked('g8' , 'w')  )  return false;

        return true;

    }
    //queen-side castling
    if (to === "c1" || to === "c8") {
        const rook = board.get(piece.color === "w" ? "a1" : "a8");
        if (!rook || rook.type !== "r" && rook.color !== piece.color) return false;
        if ((piece.color === "w" && board.get("b1") !== null && board
            .get("c1") !== null && board.get("d1") !== null) || (piece.color === "b" && board.get("b8") !== null && board.get("c8") !== null && board.get("d8") !== null)) return false;
        if (!board.getCastlingRights(piece.color).q) return false;
        if (board.isCheck() || board.isAttacked("a1", 'b')
            || board.isAttacked("b1", 'b') || board.isAttacked("c1", 'b')
            || board.isAttacked("d1", 'b') || board.isAttacked("a8", 'w')
            || board.isAttacked("b8", 'w') || board.isAttacked("c8", 'w')
            || board.isAttacked("d8", 'w')) return false;
        
        return true;
    }
    return false;
}

