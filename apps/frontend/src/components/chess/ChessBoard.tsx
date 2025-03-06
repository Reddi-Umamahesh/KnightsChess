import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { CSSProperties, useState } from "react";
import { useRecoilValue } from "recoil";
import ProfileCard from "./ProfileCard";
import Clock from "./Clock";
import { Game as GameType } from "@/hooks/gameStore";
import LoadingGame from "./LoadingGame";
import { Chessboard } from "react-chessboard";
import { MOVE } from "@/utils/constants";
import { authState } from "@/recoil/userAtoms";
import { GameState } from "@/recoil/gameAtom";
import { isPromoting } from "@/utils/helper";

interface Props {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket | null;
  setBoard: any;
  chess: Chess;
  gameRef: GameType | null;
}

const ChessBoard: React.FC<Props> = ({ board, socket, setBoard, chess, gameRef }) => {
  if (!socket) {
    return <div className="h-screen w-full">Connecting...</div>;
  }

  const auth = useRecoilValue(authState);
  const user = auth.user;
  const gameAuth = useRecoilValue(GameState);
  const game = gameRef;

  const [from, setFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<{ [square: string]: CSSProperties }>({});
  const [rightClickedSquares, setRightClickedSquares] = useState<{ [square: string]: CSSProperties }>({});

  const isBlack = user?.id === game?.blackPlayer?.id;
  const current_player = isBlack ? game?.blackPlayer : game?.whitePlayer;
  const opponent_player = isBlack ? game?.whitePlayer : game?.blackPlayer;
  const opponent_time = isBlack ? game?.timer2 : game?.timer1;
  const current_time = isBlack ? game?.timer2 : game?.timer1;

  // This function calculates and sets the styles for available moves
  const getMoveOptions = (square: Square) => {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length === 0) {
      return false;
    }
    const newSquares: { [square: string]: CSSProperties } = {};
    // Highlight available destination squares with a circle gradient.
    moves.forEach(move => {
      // If the destination square holds a piece of the same color, use a lighter highlight
      const pieceAtDestination = chess.get(move.to);
      const pieceAtSource = chess.get(square);
      const lightSquareMoveHighlight =
        "radial-gradient(circle, rgba(34, 193, 195, 0.6) 85%, transparent 85%)";
      const darkSquareMoveHighlight =
        "radial-gradient(circle, rgba(255, 204, 0, 0.6) 25%, transparent 25%)";

      newSquares[move.to] = {
        background: pieceAtDestination && pieceAtDestination.color === pieceAtSource?.color
          ? lightSquareMoveHighlight
          : darkSquareMoveHighlight,
        borderRadius: "50%"
      };
    });
    // Also highlight the selected square itself (e.g., yellow overlay)
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    setOptionSquares(newSquares);
    return true;
  };


  const onSquareClick = (square: Square) => {
    // Clear any right-click styles on new click
    setRightClickedSquares({});

    if (!from) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) {
        setFrom(square);
      }
      return;
    }

    const moves = chess.moves({ square: from, verbose: true });
    const validMove = moves.find(m => m.to === square);

    if (!validMove) {
      const hasMoves = getMoveOptions(square);
      setFrom(hasMoves ? square : null);
      return;
    }

   
    const movePayload = isPromoting(chess, from, square)
      ? { from, to: square, promotion: "q" }
      : { from, to: square };
    console.log("movePayload", movePayload);
    try {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            gameId: gameAuth.gameId,
            move: movePayload,
          },
        })
      );
      console.log("sentMove")
      chess.move(movePayload);
      console.log(chess.board())
      setBoard(chess.board());
    } catch (error) {
      console.error("Error sending move", error);
    }

    setFrom(null);
    setOptionSquares({});
  };

  const onSquareRightClick = (square: Square) => {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares((prevState) => {
      const newState = { ...prevState };
      if (newState[square]?.backgroundColor === colour) {
        delete newState[square];
      } else {
        newState[square] = { backgroundColor: colour };
      }
      return newState;
    });
  };

  const boardOrientation = isBlack ? "black" : "white";

  return (
    <div className="flex flex-col items-center">
      {/* Opponent Info */}
      <div className="w-full max-w-[600px] bg-gray-800/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <ProfileCard username={opponent_player?.name || "Opponent"} />
          <Clock time={opponent_time || 10} />
        </div>
      </div>

      {/* Chess Board */}
      <div className="w-full max-w-[600px] aspect-square bg-gray-800/50 rounded-lg p-2">
        <Chessboard
          id="ClickToMove"
          boardOrientation={boardOrientation}
          position={gameRef?.fen || "start"}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          arePiecesDraggable={false}
          // Merge our custom square styles (available moves and right-click markers)
          customSquareStyles={{ ...optionSquares, ...rightClickedSquares }}
          customLightSquareStyle={{ backgroundColor: "rgba(107,33,168,0.4)" }}
          customDarkSquareStyle={{ backgroundColor: "rgba(31,41,55,0.6)" }}
        />
      </div>

      {/* Current Player Info */}
      <div className="w-full max-w-[600px] bg-gray-800/50 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <ProfileCard username={current_player?.name || "User"} />
          <Clock time={current_time || 10} />
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;