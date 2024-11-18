import useScreenSize from '@/hooks/ScreenSIze';
import {  Color, PieceSymbol, Square } from 'chess.js';

import { stringify } from 'querystring';
import React, { useState }  from 'react'

interface props {
  Board:  ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][],
  socket: WebSocket | null;
  setBoard: any,
  Chess : any
}
const MOVE = "move"
const ChessBoard: React.FC<props> = (
  {Board , socket , setBoard , Chess}
) => {
    const isB = false;
    const { width } = useScreenSize();
      let w = 64; 
      if (width < 1200) {
        const drop = Math.floor((1200 - width) / 100); 
        w = 64 - drop * 4;
    }
    if (width <= 400) {
        
        w = 40;
    }
    if (width <= 500 && width >= 400) {
       
        w = 44
    }
    if (width <= 900 && width >= 800) {
        w = 56
    }
    if (width <= 800 && width >= 500) {
       
        w = 56;
    }
    const dim = String(w) + "px"
    const dims = String(w * 8) + "px";
    
    const boardCords:string[] = [];
    if (isB) {
        for (let i = 1; i <= 8; i++) {
          for (let j = 8; j >= 1; j--) {
            const n1 = String.fromCharCode(96 + j);
            const n2 = String(i);
            const k = n1 + n2;
            boardCords.push(k);
          }
        }
    } else {
        for (let i = 8; i >= 1; i--) {
          for (let j = 1; j <= 8; j++) {
            const n1 = String.fromCharCode(96 + j);
            const n2 = String(i);
            const k = n1 + n2;
            boardCords.push(k);
          }
        }
  }
  const [from, setFrom] = useState<String | null>(null);
  const [to, setTo] = useState<String | null>(null);
    
  if (!socket) return <div>...Connecting</div>
  return (
    <div>
      <div
        className={` rounded-lg overflow-hidden `}
        style={{
          width: dims, 
          height: dims, 
        }}
      >
        {/* {boardCords.map((coordinate, index) => {
          const isDarkSquare = (Math.floor(index / 8) + index) % 2 === 0;
          return (
            <div
              key={coordinate}
              className={`flex items-center justify-center  text-sm font-medium ${
                isDarkSquare ? "bg-white text-black" : "bg-green-700 text-black"
              }`}
              style={{
                width: dim,
                height: dim,
              }}
            >
            </div>
          );
        })} */}
        {
          Board.map((row , i) => {
            return <div key={i} className='flex '>
              {row.map((square, j) => {
                const isDarkSquare = (i + j) % 2 === 0;
                return (
                  <div
                    onClick={() => {
                      const squareRepsentation = `${boardCords[j + i * 8]}`;
                      console.log(from , to)
                      if (!from) {
                        setFrom(`${boardCords[j + i * 8]}`);
                        console.log(from, to , "sadfasf");
                      } else {
                        setTo(`${boardCords[j + i * 8]}`);
                        console.log(from, to, `${boardCords[j + i * 8]}`);
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from: from ,
                                to :squareRepsentation,
                              },
                            },
                          })
                        );
                        
                        Chess.move({
                          from: from,
                          to: squareRepsentation,
                        })
                        setBoard(Chess.board())
                        console.log(Chess.ascii())
                        setFrom(null);
                      }
                    }}
                    className={`flex items-center justify-center  text-sm font-medium ${
                      isDarkSquare
                        ? "bg-white text-black"
                        : "bg-green-700 text-black"
                      }`}
                    key={j}
                    id={`${boardCords[j + i * 8 ]}`}
                    style={{
                      width: dim,
                      height: dim,
                    }}
                  >
                    {square ? square.type : ""}
                  </div>
                );
              })}
            </div>
          })
        }

      </div>
    </div>
  );
}

export default ChessBoard