import { useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";

import { useNavigate } from "react-router-dom";
import { GAME_OVER, INIT_GAME, MOVE } from "@/utils/constants";
import {  useRecoilValue } from "recoil";
import { userState } from "@/recoil/userAtoms";
import UtiliyBox from "@/components/board/UtiliyBox";
import { getJWTTOKENFromLocalStorage } from "@/lib/utils";

const Game = () => {
  const token = getJWTTOKENFromLocalStorage();
  const user = useRecoilValue(userState);
  if (!token) {
    return <div>...connecting</div>;
  }
  const navigate = useNavigate();
  const socket = useSocket(token);
  console.log(user, "game");
  console.log(socket);
  const [chess, SetChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          console.log(message.payload );
          setMsg(message.payload)
          console.log("game started " );
          break;
        case MOVE:
          console.log("inside switch");
          const move = message.payload.move;
          console.log("movinggg...", move, message);
          console.log(chess.ascii());
          chess.move({
            from: move.from,
            to: move.to,
          });
          setBoard(chess.board());
          console.log(chess.ascii());
          console.log("moved");
          break;

        case GAME_OVER:
          console.log("game over");
      }
    };
  }, [socket, chess, board]);

  if (!socket) {
    return (
      <div>
        <a href="/">back</a>
        <h1>Connecting to server...</h1>
      </div>
    );
  }

  return (
    <div className=" w-full grid cust960:grid-cols-9  grid-cols-1 text-white sm:px-20 px-5  py-4 gap-5  min-h-screen">
      <div className=" col-span-5    sm:p-12 p-5 flex items-center justify-center">
        <ChessBoard
          Board={board}
          socket={socket}
          setBoard={setBoard}
          Chess={chess}
          msg={msg}
        />{" "}
      </div>
      {/* utility box */}
      <div className="col-span-3 flex lg:mt-[25%] justify-center">
        <UtiliyBox />
      </div>
      <div className="col-span-1 "></div>
    </div>
  );
};

export default Game;
