import ChessBoard from "@/components/chess/ChessBoard";
import UtilityBox from "@/components/chess/Utilitybox";
import { Game as GameType } from "@/hooks/gameStore";
import useWebSocket from "@/hooks/useSocket";
import { GameState } from "@/recoil/gameAtom";
import { Chess, Move, Square } from "chess.js";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isPromoting } from "@/utils/helper";
import { DRAW_ACCEPT, DRAW_OFFER, DRAW_REJECT, GAME_OVER, inital_Fen, MOVE, TIME_UPDATE } from "@/utils/constants";
import { authState } from "@/recoil/userAtoms";



export const Game = () => {
  const { socket  } = useWebSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isGameOver, setIsGameOver] = useState(false);
  const gameAuth = useRecoilValue(GameState);
  const game = gameAuth.game;
  const auth = useRecoilValue(authState);
  const gameRef = useRef<GameType | null>(game);
  const user = auth.user;
  const setGame = useSetRecoilState(GameState);
  const [from, setFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<{ [square: string]: CSSProperties }>({});
  const [rightClickedSquares, setRightClickedSquares] = useState<{ [square: string]: CSSProperties }>({});
  const [drawOffer , setDrawOffer] = useState(false)
  chess.load(gameRef.current?.fen || inital_Fen)

  const handleGameState = (gameId: string, game: GameType) => {
    setGame({
      gameId: gameId,
      game: game
    })
    gameRef.current = game;
  };

  const reload = () => {
    if (!localStorage.getItem("reload")) {
      return 
    }
    console.log(board ,isGameOver)
    localStorage.removeItem("reload");
    location.reload();
    
  }
  reload();
  useEffect(() => {
    if (!socket) return;
    console.log("Re-rendering Game component due to WebSocket reconnection" , chess.board());
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const payload = message.payload;
      // console.log("message", message);
      setBoard(chess.board());
      const gameId = message.payload?.gameId;
      switch (message.type) {
        case MOVE:
          try {
            console.log("MOVE", message, payload)
            if (!gameRef.current) return;
            const move = message.payload.move as Move;
            console.log("from switch ,", move);
            const currGame = gameRef.current;
            if (currGame && currGame.gameId === message.payload.gameId) {
              const updatedGame = {
                ...currGame,
                moves: [...currGame.moves || [], move],
                moveCount: currGame.moveCount + 1,
                fen: payload.fen
              }
              handleGameState(gameId, updatedGame);
              console.log("move", chess.board())
              chess.load(gameRef.current.fen || inital_Fen)
              setBoard(chess.board());
              console.log("moved", updatedGame);
            }
          } catch (e) {
            console.log(e)
          }
          
          break;
        case DRAW_OFFER:
          console.log("draw sent by");
          const senderId = message.payload.senderId
          if (user?.id !== senderId) {
            setDrawOffer(true)
            setTimeout(() => {
              setDrawOffer(false)
            },10* 1000)
          }
          break;
        case GAME_OVER:
          if (!gameRef.current) return;
          console.log("game ended" , message);
          const currGame = gameRef.current;
          if (currGame) {
            const updatedGame = {
              ...currGame,
              status: payload.status,
              result: payload.result,
              fen : payload.current_fen
            }
            handleGameState(gameId, updatedGame);
            setIsGameOver(true);
          }
          break;
        case TIME_UPDATE:
          const curr_game = gameRef.current;
          if (curr_game && curr_game?.gameId === message.payload.gameId) {
            const updatedGame = {
              ...curr_game,
              timer1: parseInt(message.payload.player1_time, 10), 
              timer2: parseInt(message.payload.player2_time, 10), 
            };
            handleGameState(gameId, updatedGame);
          }
          break;
      }

    };
    socket.addEventListener("message", handleMessage);
    return () => {
      console.log("removinggg")
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket ]);

  const resignGame = () => {
    try {
      socket?.send(
        JSON.stringify({
          type: "RESIGNATION",
          gameId: gameAuth.gameId,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }
  const offerDraw = () => {
    try {
      socket?.send(
        JSON.stringify({
          type: "draw_offer",
          gameId: gameAuth.gameId,
        })
      );
      
    } catch (e) {
      console.error(e);
    }
  }
  const handleDrawOffer = (type: string) => {
    try {
      socket?.send(
        JSON.stringify({
          type: type,
          gameId: game?.gameId,
        })
      );
    } catch (e) {
      console.log(e);
    } finally {
      setDrawOffer(false);
    }
  };
  const getMoveOptions = (square: Square) => {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length === 0) {
      return false;
    }
    console.log("moves" , moves)
    const newSquares: { [square: string]: CSSProperties } = {};
   
    moves.forEach(move => {
  
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

    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)"
    };
    setOptionSquares(newSquares);
    return true;
  };
  const onSquareClick = (square: Square) => {
    
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
      socket?.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            gameId: gameAuth.gameId,
            move: movePayload,
          },
        })
      );
      console.log("sentMove")
      console.log(chess.board(), gameRef.current?.fen, chess.fen())
    } catch (error) {
      console.error("Error sending move", error);
    }

    setFrom(null);
    setOptionSquares({});
  };

  const onSquareRightClick = (square: Square) => {
    const colour = "rgba(0, 0, 255, 0.4)";
    console.log("clicked")
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
  if (!socket) {
    console.log("returning ")
    return <div className="text-white">Connecting to game server...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full flex flex-col lg:flex-row flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen text-gray-100">
        <div className="w-full h-full flex flex-col lg:flex-row gap-8 p-4">
          {/* Chess Board Section - Grow to available space */}
          <div className="flex-1 h-full min-h-[500px] lg:min-h-0">

            <ChessBoard
              socket={socket}
              gameRef={gameRef.current}
              optionSquares={optionSquares}
              rightClickedSquares={rightClickedSquares}
              OnSquareClick={onSquareClick}
              OnSquareRightClick={onSquareRightClick}
            />
          </div>

          {/* Utility Box Section - Fixed width on large screens */}
          <div className="lg:w-[600px] h-full flex flex-col">
            {drawOffer && (
              <div className="absolute top-0 right-0 w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                <p className="text-white mb-4">Your opponent has offered a draw.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleDrawOffer("draw_accept")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDrawOffer("draw_reject")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
            <UtilityBox offerDraw={offerDraw} resignGame={resignGame} moves={gameRef.current?.moves ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};
