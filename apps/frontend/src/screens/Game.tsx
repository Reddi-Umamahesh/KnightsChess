import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import {  useWebSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";

import { GAME_ADDED, GAME_OVER, INIT_GAME, MOVE } from "@/utils/constants";
import { useRecoilValue } from "recoil";
import { authState } from "@/recoil/userAtoms";
import UtiliyBox from "@/board/UtiliyBox";

const Game = () => {

  const def = useRecoilValue(authState);
  const user = def.user
  if (user == null) {
    return <div></div>;
  }
  // const navigate = useNavigate();
  const socket = useWebSocket();
  console.log(user, "game");
  console.log(socket);
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    console.log("useeffect");
    if (!socket) return;
    console.log("socket");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message , "from hereeee");
      switch (message.type) {
        case GAME_ADDED:
          console.log("game added");
          break;
        case INIT_GAME:
          console.log("recieved init game");
          setBoard(chess.board());
          console.log(message.payload);
          setMsg(message.payload);
          console.log("game started ");
          break;
        case MOVE:
          console.log("move");
          break;

        case GAME_OVER:
          console.log("game over");
          break;
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
    <div>
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
    </div>
  );
};

export default Game;
