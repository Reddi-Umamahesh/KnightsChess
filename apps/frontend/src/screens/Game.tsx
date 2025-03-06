import { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import { Chess } from "chess.js";
import { GAME_ADDED, GAME_OVER, INIT_GAME, MOVE } from "@/utils/constants";
import { useRecoilValue } from "recoil";
import { authState } from "@/recoil/userAtoms";
import UtiliyBox from "@/board/UtiliyBox";
import useWebSocket from "@/hooks/useSocket";

const Game = () => {
  // Always call hooks at the top of your component
  const auth = useRecoilValue(authState);
  const { socket } = useWebSocket();
  const user = auth.user;

  // These hooks will always run, regardless of user/socket state
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [msg, setMsg] = useState<any>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message, "from hereeee");
      console.log(message.type);
      switch (message.type) {
        case GAME_ADDED:
          console.log("game added");
          break;
        case INIT_GAME:
          console.log("received init game");
          setBoard(chess.board());
          setMsg(message.payload);
          console.log("game started ");
          break;
        case MOVE:
          console.log("move");
          break;
        case GAME_OVER:
          console.log("game over");
          break;
        default:
          break;
      }
    };

    // Optionally, clean up the listener on unmount or socket change
    return () => {
      socket.onmessage = null;
    };
  }, [socket, chess]);

  // Now that all hooks have been called, you can conditionally render your UI.
  if (!socket) {

    return <div>Connecting...</div>;
  }
  if (!user) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div className="w-full grid cust960:grid-cols-9 grid-cols-1 text-white sm:px-20 px-5 py-4 gap-5 min-h-screen">
        <div className="col-span-5 sm:p-12 p-5 flex items-center justify-center">
          <ChessBoard
            Board={board}
            socket={socket}
            setBoard={setBoard}
            Chess={chess}
            msg={msg}
          />
        </div>
        <div className="col-span-3 flex lg:mt-[25%] justify-center">
          <UtiliyBox />
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};

export default Game;
