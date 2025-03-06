import ChessBoard from "@/components/chess/ChessBoard";
import LoadingGame from "@/components/chess/LoadingGame";
import UtilityBox from "@/components/chess/Utilitybox";
import { Game as GameType } from "@/hooks/gameStore";
import useWebSocket from "@/hooks/useSocket";
import { GameState } from "@/recoil/gameAtom";
import { authState } from "@/recoil/userAtoms";
import { Chess, Move } from "chess.js";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from 'react-chessboard';
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_ENDED = "game_ended";
const GAME_ADDED = "game_added";
const EXIT_GAME = "exit_game";
const JOIN_ROOM = "join_room";
const GAME_JOINED = "game_joined";
const DRAW_OFFER = "draw_offer";
const DRAW_ACCEPT = "draw_accept";
const DRAW_REJECT = "draw_reject";
const TIME_UPDATE = "TIME_UPDATE";
const GAME_OVER = "game_over";

export const Game = () => {
  const { socket } = useWebSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isGameOver, setIsGameOver] = useState(false);
  const auth = useRecoilValue(authState);
  const user = auth.user;
  const gameAuth = useRecoilValue(GameState);
  const gameId = gameAuth.gameId;
  const game = gameAuth.game;
  const params = useParams();
  const gameRef = useRef<GameType | null>(game);
  const setGame = useSetRecoilState(GameState);
  // useEffect(() => {
  //   if (!socket || !params.gameId) return;
  //   console.log("from first useEffect ");
  //   const updateConnectionState = () => {
  //     setIsConnected(socket.readyState === WebSocket.OPEN);
  //   };
  //   updateConnectionState();
  //   const handleOpen = () => {
  //     setIsConnected(true);
  //     console.log("WebSocket connected");
  //   };

  //   const handleClose = () => {
  //     setIsConnected(false);
  //     console.log("WebSocket disconnected");
  //   };

  //   socket.addEventListener("open", handleOpen);
  //   socket.addEventListener("close", handleClose);
  //   console.log(socket);
  //   return () => {
  //     socket.removeEventListener("open", handleOpen);
  //     socket.removeEventListener("close", handleClose);
  //   };
  // }, [socket]);


  const handleGameState = ( gameId :string, game: GameType) => {
    setGame({
      gameId: gameId,
      game : game
    })
    gameRef.current = game;
  };

  const gameOverFunction = () => {
    setIsGameOver(true);
  };

  useEffect(() => {
    if (!socket) return;
    console.log("from useEffect Game page");
    // const storedGame = localStorage.getItem("current_game");
    // if (storedGame) {
    //   const newGame: GameType = JSON.parse(storedGame);
    //   handleGameState(gameId || "", newGame);
    //   console.log("game started, form switch", newGame);
    // }
    const handleMessage = (event:MessageEvent) => {
      console.log("H");
      const message = JSON.parse(event.data);
      const payload = message.payload;
      console.log("message", message);
      setBoard(chess.board());
      const gameId = message.payload?.gameId;
      switch (message.type) {
        case INIT_GAME:
          console.log("triggered INIT_GAME");
          const updatedGame: GameType = {
            gameId : gameId , 
            game_type: payload.varient,
            moveCount: 0,
            whitePlayer: payload.whitePlayer,
            blackPlayer: payload.blackPlayer,
            fen: payload.fen,
            moves: [],
            status: "IN_PROGRESS",
            result: null,
            timer1: payload.player1_time,
            timer2: payload.player2_time,
          };
          localStorage.setItem("current_game", JSON.stringify(updatedGame));
          handleGameState(gameId , updatedGame);
          break;
        case MOVE:
          console.log("MOVE")
          if (!gameRef.current) return;
          const move = message.payload.move as Move;
          console.log("from switch ,", move);
          const game = gameRef.current;
          game.moves?.push(move);
          game.moveCount++;
          game.fen = payload.fen;
          handleGameState(gameId , game);
          chess.move(move);
          setBoard(chess.board());
          console.log("moved", game);
          break;
        case DRAW_OFFER:
          console.log("draw sent by", payload.senderId);
          break;
        case DRAW_ACCEPT:
          console.log("draw accepted game ended by agrement");
          break;
        case DRAW_REJECT:
          console.log("draw rejected game ended by rejection");
          break;
        case GAME_OVER:
          if (!gameRef.current) return;
          console.log("game ended");

          const g = gameRef.current;
          g.status = payload.status;
          g.result = payload.result;
          g.moves = payload.moves;
          g.fen = payload.current_fen;

          handleGameState(gameId , g);
          setIsGameOver(true);
          break;
      }

    };
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, chess, handleGameState]);

  if (!socket) {
    return <div className="text-white">Connecting to game server...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full flex flex-col lg:flex-row flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen text-gray-100">
        <div className="w-full h-full flex flex-col lg:flex-row gap-8 p-4">
          {/* Chess Board Section - Grow to available space */}
          <div className="flex-1 h-full min-h-[500px] lg:min-h-0">
          
                <ChessBoard
                  board={board}
                  socket={socket}
                  gameRef={gameRef.current}
                  setBoard={setBoard}
                  chess={chess}
                />
              
           
          </div>

          {/* Utility Box Section - Fixed width on large screens */}
          <div className="lg:w-[600px] h-full flex flex-col">
            <UtilityBox />
          </div>
        </div>
      </div>
    </div>
  );
};
