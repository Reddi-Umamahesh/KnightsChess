import { useEffect, useState } from "react";
import {
  Crown,
  History,
  TrendingUp,
  Users,
  ChevronDown,
  Clock,
  User,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { authState } from "@/recoil/userAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import handleLogout from "@/features/auth/Logout";
import { useNavigate } from "react-router-dom";
import useWebSocket from "@/hooks/useSocket";
import { toast } from "react-toastify";
import { GAME_ADDED, INIT_GAME } from "@/utils/constants";
import { Game as GameType } from "@/hooks/gameStore";
import { GameState } from "@/recoil/gameAtom";
import LoadingGame from "@/components/chess/LoadingGame";
 // adjust the path as needed

function Home() {
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // waitingForGame will be true when the server sends GAME_ADDED, so we show the loader
  const [waitingForGame, setWaitingForGame] = useState(false);
  // gameInitialized prevents further processing once the game is set up
  const [gameInitialized, setGameInitialized] = useState(false);
  const auth = useRecoilValue(authState);
  const user = auth.user;
  const navigate = useNavigate();
  const socket  = useWebSocket();
  const game = useRecoilValue(GameState).game;
  const setGame = useSetRecoilState(GameState);

  useEffect(() => {
    if (!socket) {
      console.log("returing")
      return;
    }
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        const msgType = message.type;
        // Only process messages if game isn't already initialized
        if (!gameInitialized) {
          if (msgType === GAME_ADDED) {
            // No waiting opponent; show the loading component
            console.log("GAME_ADDED received – waiting for opponent...");
            setWaitingForGame(true);
          } else if (msgType === INIT_GAME) {
            // An opponent is available; process game data and navigate
            console.log("INIT_GAME received – processing game and navigating");
            const gameId = message.payload?.gameId;
            const payload = message.payload;
            if (gameId) {
              const newgame: GameType = {
                gameId,
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
              localStorage.setItem("current_game", JSON.stringify(newgame));
              setGame({
                gameId: newgame.gameId,
                game: newgame,
              });
              setGameInitialized(true);
              setWaitingForGame(false);
              navigate(`/game/${gameId}`);
            } else {
              console.error("INIT_GAME message received without gameId");
            }
          }
        }
      } catch (error) {
        console.error("Error processing socket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, navigate, setGame, gameInitialized]);

  // If waitingForGame is true, display the loading component so the user sees a clear "waiting" indicator.
  if (waitingForGame) {
    return <LoadingGame />;
  }

  if (!socket) {
    return null;
  }

  // When the user clicks on "New Game", send an INIT_GAME message.
  // Depending on the server response, either an immediate INIT_GAME (if an opponent is waiting)
  // or a GAME_ADDED (if not) will be received.
  const handleNewGame = () => {
    // Reset the state in case the user is initiating a new game.
    setWaitingForGame(false);
    setGameInitialized(false);
    console.log("Requesting new game...");
    if (!socket) {
      toast.error("Connecting to server...");
      return;
    }
    const sendInitGame = () => {
      console.log("Sending INIT_GAME message to server");
      socket.send(JSON.stringify({ type: INIT_GAME }));
    };
    if (socket.readyState === WebSocket.OPEN) {
      sendInitGame();
    } else {
      socket.addEventListener("open", sendInitGame, { once: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 bg-gray-800 p-2 rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-100" />
        ) : (
          <Menu className="w-6 h-6 text-gray-100" />
        )}
      </button>

      {/* Left Sidebar - Desktop */}
      <div className="hidden lg:block w-64 bg-gray-800 border-r border-purple-900/20 p-4">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-amber-500 rounded-full mb-4"></div>
          <h3 className="text-xl font-bold text-gray-100">{user?.name}</h3>
          <p className="text-amber-500 font-bold">--</p>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between">
            <span className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between">
            <span className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Game History
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Statistics
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-9">
          <button
            onClick={() => handleLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between"
          >
            <span className="flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40 flex items-center justify-center">
          <div className="p-4 w-full max-w-sm">
            <div className="space-y-4">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-amber-500 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-gray-100">
                  {user?.name}
                </h3>
                <p className="text-amber-500 font-bold">--</p>
              </div>
              <button
                onClick={handleNewGame}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <Crown className="w-5 h-5 mr-2" />
                New Game
              </button>
              <button className="w-full bg-purple-700 hover:bg-purple-600 text-gray-100 py-3 px-4 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Play with Friends
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-3 px-4 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Learn Chess
              </button>
              <button
                onClick={() => handleLogout(navigate)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Center Content */}
          <div className="flex-1 p-4 lg:p-8">
            <div
              className="w-full h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)] bg-cover bg-center rounded-xl border border-purple-900/20 relative overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
                  Welcome Back, {user?.name}!
                </h1>
                <p className="text-lg lg:text-xl text-gray-300 mb-8">
                  Ready for your next challenge?
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-72 bg-gray-800 border-t lg:border-l border-purple-900/20 p-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              Quick Access
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center justify-between"
                  onClick={() => setIsGameMenuOpen(!isGameMenuOpen)}
                >
                  <span className="flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    New Game
                  </span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                {isGameMenuOpen && (
                  <div className="absolute w-full mt-2 bg-gray-700 rounded-lg shadow-xl border border-purple-900/20 overflow-hidden z-10">
                    <button
                      onClick={handleNewGame}
                      id="Bullet"
                      className="w-full px-4 py-2 text-left hover:bg-gray-600 text-gray-100 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Bullet (1 min)
                    </button>
                    <button
                      onClick={handleNewGame}
                      id="Blitz"
                      className="w-full px-4 py-2 text-left hover:bg-gray-600 text-gray-100 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Blitz (3+2)
                    </button>
                    <button
                      onClick={handleNewGame}
                      id="Rapid"
                      className="w-full px-4 py-2 text-left hover:bg-gray-600 text-gray-100 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Rapid (10+0)
                    </button>
                  </div>
                )}
              </div>
              <button className="w-full bg-purple-700 hover:bg-purple-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Play with Friends
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 px-4 rounded-lg flex items-center justify-between">
                <span className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Learn Chess
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
