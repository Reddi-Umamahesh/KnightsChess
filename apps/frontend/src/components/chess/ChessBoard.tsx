import { Square } from "chess.js";
import { CSSProperties, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import ProfileCard from "./ProfileCard";
import Clock from "./Clock";
import { Game as GameType } from "@/hooks/gameStore";
import { Chessboard } from "react-chessboard";
import { authState } from "@/recoil/userAtoms";
import GameResultCard from "./GameResultCard";
import { GAME_RESULT } from "@/utils/constants";

type OnSquareClick = (square: Square) => void;
type OnSquareRightClick = (square: Square) => void;

interface Props {
  socket: WebSocket | null;
  gameRef: GameType | null;
  optionSquares: Record<string, CSSProperties>;
  rightClickedSquares: Record<string, CSSProperties>;
  OnSquareClick: OnSquareClick;
  OnSquareRightClick: OnSquareRightClick;
}

const ChessBoard: React.FC<Props> = (
  { socket, gameRef, OnSquareClick, OnSquareRightClick, optionSquares, rightClickedSquares }
) => {
  if (!socket) {
    return <div className="h-screen w-full">Connecting...</div>;
  }

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<"WIN" | "LOSE" | "DRAW">("DRAW");
  const auth = useRecoilValue(authState);
  const user = auth.user;
  const game = gameRef;
  const isBlack = user?.id === game?.blackPlayer?.id;
  const current_player = isBlack ? game?.blackPlayer : game?.whitePlayer;
  const opponent_player = isBlack ? game?.whitePlayer : game?.blackPlayer;
  const opponent_time = isBlack ? game?.timer1 : game?.timer2;
  const current_time = isBlack ? game?.timer2 : game?.timer1;
  const boardOrientation = isBlack ? "black" : "white";
  const onClose = () => {
    setShowResult(false)
  }

  useEffect(() => {
    if (game?.result) {
      const res: GAME_RESULT = game.result;
      if (res === "WHITE_WINS" || res === "BLACK_WINS") {
        setResult(isBlack === (res === "BLACK_WINS") ? "WIN" : "LOSE");
      }

      const timeOut = setTimeout(() => {
        setShowResult(true);
      }, 500);

      return () => clearTimeout(timeOut);
    }
  }, [game?.result, isBlack]);

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
          onSquareClick={OnSquareClick}
          onSquareRightClick={OnSquareRightClick}
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

      {showResult && game?.result && (
        <GameResultCard
          winner={game?.result === "WHITE_WINS" ? game.whitePlayer?.name : game.blackPlayer?.name}
          loser={game?.result === "WHITE_WINS" ? game.blackPlayer?.name : game.whitePlayer?.name}
          result={result} onClose={onClose} cause={game.status} />
      )}
    </div>
  );
};

export default ChessBoard;
