import { BLACK, Square, WHITE } from "chess.js";
import React, { useState } from "react";
import useScreenSize from "@/hooks/ScreenSIze";
import {
  // BaseUserInterface,
  Color,
  getWidth,
  message,
  PieceSymbol,
} from "@/utils/constants";
import { useRecoilValue } from "recoil";

// import { GuestUser, user } from "@/recoil/guestUserAtom";
import { authState } from "@/recoil/userAtoms";
import PlayerInfo from "../board/PlayerInfo";
// import WaitLoader from "../board/WaitLoader";

interface props {
  Board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: any;
  Chess: any;
  msg: message | null;
}

const MOVE = "move";
const ChessBoard: React.FC<props> = ({
  Board,
  socket,
  setBoard,
  Chess,
  msg,
}) => {
  
  const { width } = useScreenSize();
  const def = useRecoilValue(authState);
  const user = def.user
  console.log(msg);
  console.log(user);
  const { SquareWidth, BoardWidth } = getWidth(width);
  const [from, setFrom] = useState<String | null>(null);
  const [to, setTo] = useState<String | null>(null);
  const isBlack = user && msg && user.userId === msg.blackPlayer.userId ? true : false;
  const OppositePlayer = isBlack ? msg?.whitePlayer : msg?.whitePlayer;

  const handleClick = (
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null,
    i: number,
    j: number
  ) => {
    const squareRepresentation = getReversedSquareID(i, j);

    if (!socket) return;

    console.log(socket);
    if (!from) {
      console.log(square);
      setFrom(squareRepresentation);
    } else {
      setTo(squareRepresentation);
      console.log(to);
      if (!socket) return;
      console.log("Sending MOVE:", {
        type: MOVE,
        payload: {
          move: {
            from,
            to: squareRepresentation,
          },
        },
      });
      try {
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to: squareRepresentation,
              },
            },
          })
        );
        Chess.move({
          from: from,
          to: squareRepresentation,
        });
        setBoard(Chess.board());
        setFrom(null);
        setTo(null);
        console.log("board page", Chess.ascii());
      } catch (e) {
        console.log("Error sending message", e);
        setFrom(null);
        setTo(null);
      }
    }
  };
  const getReversedBoard = () => {
    if (!isBlack) return Board;
    return Board.slice()
      .reverse()
      .map((row) => row.slice().reverse());
  };
  const getReversedSquareID = (i: number, j: number) => {
    if (isBlack) {
      return `${String.fromCharCode(97 + (7 - j))}${i + 1}`;
    } else {
      return `${String.fromCharCode(97 + j)}${8 - i}`;
    }
  };

  const getReversedPiece = (
    square: { square: Square; type: PieceSymbol; color: Color } | null
  ) => {
    if (!square) return undefined;
    const { type, color } = square;
    return color === "w" ? `${type.toUpperCase()} w.png` : `${type}.png`;
  };
  const currentTurn = Chess.turn();
  console.log(msg , isBlack , OppositePlayer);
  if (!socket) return <div className="h-screen w-full">...Connecting</div>;
  return (
    <div className="h-auto over">
      <div className="py-2">
        <PlayerInfo
          player={OppositePlayer}
          height={SquareWidth}
          width={BoardWidth}
          isBlack
          isActive={
            OppositePlayer &&
            ((!isBlack && currentTurn === BLACK) ||
              (isBlack && currentTurn === WHITE))
              ? true
              : false
          }
        />
      </div>
      <div
        className={` rounded-lg overflow-hidden  `}
        style={{
          width: BoardWidth,
          height: BoardWidth,
        }}
      >
        {/* <div className="flex items-center justify-center ">{loading ? <WaitLoader isLoading={loading} /> : ""}</div> */}
        {getReversedBoard().map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const isDarkSquare = (i + j) % 2 === 0;
                return (
                  <div
                    onClick={() => handleClick(square, i, j)}
                    className={` relative flex items-center p-[4px] justify-center  text-sm font-medium ${
                      isDarkSquare
                        ? "bg-[#EBECD0] text-black"
                        : "bg-[#739552] text-black"
                    }`}
                    key={j}
                    id={getReversedSquareID(i, j)}
                    style={{
                      width: SquareWidth,
                      height: SquareWidth,
                    }}
                  >
                    {j === 0 && (
                      <div className="absolute top-0 left-0 text-center text-xs p-1 z-10">
                        {i + 1}
                      </div>
                    )}

                    {i === 7 && (
                      <div className="absolute bottom-0 right-0 text-center text-xs p-1 z-10">
                        {String.fromCharCode(97 + j)}{" "}
                      </div>
                    )}

                    {square ? (
                      <img
                        className="absolute "
                        src={getReversedPiece(square)}
                        alt={square.type}
                        style={{
                          width: "85%",
                          height: "85%",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="py-2">
        <PlayerInfo
          player={user}
          height={SquareWidth}
          width={BoardWidth}
          isBlack
          isActive={
            OppositePlayer &&
            ((isBlack && currentTurn === BLACK) ||
              (!isBlack && currentTurn === WHITE))
              ? true
              : false
          }
        />
      </div>
    </div>
  );
};

export default ChessBoard;
