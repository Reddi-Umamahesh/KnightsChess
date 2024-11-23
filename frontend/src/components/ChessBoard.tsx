
import { Color, PieceSymbol, Square } from "chess.js";

import React, { useState } from "react";
import useScreenSize from "@/hooks/ScreenSIze";
import { getWidth } from "@/utils/constants";
interface props {
  Board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: any;
  Chess: any;
  isBlack : boolean
}
const MOVE = "move";
const ChessBoard: React.FC<props> = ({ Board, socket, setBoard, Chess , isBlack }) => {
  const { width } = useScreenSize();
  const { SquareWidth, BoardWidth } = getWidth(width);
  const [from, setFrom] = useState<String | null>(null);
  const [to, setTo] = useState<String | null>(null);
  const handleClick = (
    square: {
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null,
    i: number,
    j: number
  ) => {
    const squareRepresentation = getReversedSquareID(i,j);
    
    if (!socket) return 
    
    console.log(socket)
    if (!from) {
      console.log(square)
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
    return Board.slice().reverse().map(row =>
      row.slice().reverse()
    );
  };
  const getReversedSquareID = (i: number, j: number) => {
    if (isBlack) {
      return `${String.fromCharCode(97 + (7 - j))}${8 - i}`
    } else {
      return `${String.fromCharCode(97 + j )}${8 - i}`
    }
  }

  const getReversedPiece = (square: { square: Square; type: PieceSymbol; color: Color } | null) => {
     if (!square) return undefined;
    const { type, color } = square;
    return color === "w" ? `${type.toUpperCase()} w.png` : `${type}.png`;
  }

  if (!socket) return <div>...Connecting</div>;
  return (
    <div>
      <div
        className={` rounded-lg overflow-hidden `}
        style={{
          width: BoardWidth,
          height: BoardWidth,
        }}
      >
       
        {getReversedBoard().map((row, i) => {
          return (
            <div key={i} className="flex ">
              {row.map((square, j) => {
                const isDarkSquare = (i + j) % 2 === 0;
                return (
                  <div
                    onClick={() => handleClick(square, i, j)}
                    className={`flex items-center p-[4px] justify-center  text-sm font-medium ${
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
                    {square ? (
                      <img
                        className=""
                        src={getReversedPiece(square)} 
                        alt={square.type}
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
    </div>
  );
};

export default ChessBoard;
