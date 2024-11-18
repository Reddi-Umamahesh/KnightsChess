import React, { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";

const Game: React.FC = () => {
  const INIT_GAME = 'init_game'
  const MOVE = "move";
  const socket = useSocket();
  const [chess, SetChess] = useState(new Chess());
  const [board , setBoard] = useState(chess.board())
  
  useEffect(() => {
    if (!socket) {
      "not found"
      return
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      switch (message.type) {
        case INIT_GAME:
          SetChess(new Chess())
          setBoard(chess.board())
          console.log("game started")
          break
        case MOVE:
          const move = message.payload.move;
          console.log("movinggg..." , move);
          chess.move(move)
          setBoard(chess.board())
          console.log("moved")
          break;
        
      }
    }

    }, [socket])



  return (
    <div className=" w-full grid cust960:grid-cols-9  grid-cols-1 text-white sm:px-20 px-5  py-4 gap-5  min-h-screen">
      <div className=" col-span-5    sm:p-12 p-6 flex items-center justify-center">
        <ChessBoard  Board={board} socket={socket} setBoard={(setBoard)} Chess={chess}/>{" "}
      </div>
      <div className="col-span-3  bg-[#00000024] flex flex-col justify-center items-center p-6">
        
        <Button
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            )
          }}
          className="w-64 h-12  text-2xl bg-green-700 hover:bg-green-800 font-semibold">
          Play
        </Button>
      </div>
      <div className="col-span-1 "></div>
    </div>
  );
};

export default Game;
