import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  useSetRecoilState } from "recoil";
import { GameState } from "@/recoil/gameAtom";
import { Game as GameType } from "@/hooks/gameStore";
import useWebSocket from "@/hooks/useSocket";
import { toast } from "react-toastify";
import { CREATE_ROOM, GAME_ADDED, GAME_MODE, INIT_GAME, JOIN_ROOM } from "@/utils/constants";
import LoadingGame from "@/components/chess/LoadingGame";
import PrivateRoomDialog from "@/components/chess/PrivateRoomDialog";
import Header from "@/components/home/Header";

import { ChevronRight, Trophy } from "lucide-react";

function HomePage() {
    const [activeTab, setActiveTab] = useState("Play");
    const [showPrivateDialog, setShowPrivateDialog] = useState(false);
    const [waitingForGame, setWaitingForGame] = useState(false);
    const [waitingMessage, setWaitingMessage] = useState("");
    const navigate = useNavigate()
    const { socket } = useWebSocket();
    const setGame = useSetRecoilState(GameState);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                const msgType = message.type;
                if (msgType === GAME_ADDED) {
                    setWaitingForGame(true);
                    setWaitingMessage(message.payload.message);
                } else if (msgType === INIT_GAME) {
                    const gameId = message.payload?.gameId;
                    const newgame: GameType = {
                        gameId,
                        game_type: message.payload.varient,
                        moveCount: 0,
                        whitePlayer: message.payload.whitePlayer,
                        blackPlayer: message.payload.blackPlayer,
                        fen: message.payload.fen,
                        moves: [],
                        status: "IN_PROGRESS",
                        varient: message.payload.varient,
                        result: null,
                        timer1: message.payload.player1_time,
                        timer2: message.payload.player2_time,
                    };
                    localStorage.setItem("current_game", JSON.stringify(newgame));
                    localStorage.setItem("reload", "1");
                    setGame({ gameId: newgame.gameId, game: newgame });
                    setWaitingForGame(false);
                    navigate(`/game/${gameId}`);
                }
            } catch (error) {
                console.error("Error processing socket message:", error);
            }
        };

        socket.addEventListener("message", handleMessage);
        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    const handleGameModeClick = (mode:GAME_MODE) => {
        if (!socket) {
            toast.error("Connecting to server...");
            return;
        }
        socket.send(JSON.stringify({ type: INIT_GAME , varient :mode }));
    };
    const handleCreateRoom = (mode:GAME_MODE) => {
        if (!socket) {
            toast.error("Connecting to server...");
            return;
        }
        setWaitingForGame(true)
        socket.send(JSON.stringify({ type: CREATE_ROOM, varient: mode }));
    };
    const handleJoinRoom = (roomId :string) => {
        if (!socket) {
            toast.error("Connecting to server...");
            return;
        }
        socket.send(JSON.stringify({ type: JOIN_ROOM, roomId : roomId }));
    };
    const handlePrivateRoomClick = () => {
        setShowPrivateDialog(true);
    };

    if (waitingForGame) {
        return <LoadingGame link="" message={waitingMessage} />;
    }

    if (!socket) {
        return <LoadingGame link="/home" message="loading please wait..." />;
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8">
                <Header />
                <main className="pb-8">
                    <div className="flex justify-between items-start mb-10">
                        <div className="max-w-lg">
                            <h1 className="text-4xl font-bold mb-3 text-white">Be the new ChessMaster.</h1>
                            <p className="text-lg text-gray-300">Play challenges, battle with friends and enter tournaments!</p>
                        </div>
                        <div className="text-yellow-400">
                            <Trophy size={48} />
                        </div>
                    </div>
                    {/* Navigation tabs */}
                    <div className="flex space-x-8 mb-10 border-b border-gray-800 pb-2 overflow-x-auto">
                        {['Play', 'Tournaments', 'Learn', 'Leaderboard'].map((tab) => (
                            <button
                                key={tab}
                                className={`pb-2 text-lg ${activeTab === tab
                                        ? 'text-yellow-400 font-medium border-b-2 border-yellow-400'
                                        : 'text-gray-400'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* <Tabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}

                    {activeTab === 'Play' && (
                        <div className="grid grid-cols-12 gap-6">
                            <div
                                className="col-span-12 lg:col-span-6 bg-[#2196F3] rounded-lg p-6 relative overflow-hidden h-64 lg:h-[400px] cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleGameModeClick('RAPID')}
                            >
                                <div className="relative z-10">
                                    <h2 className="text-2xl lg:text-3xl font-bold mb-3">Rapid</h2>
                                    <p className="text-lg opacity-90">Take your time and play deep strategic games</p>
                                </div>
                                <div className="absolute bottom-6 right-6 bg-black bg-opacity-20 rounded-full p-3">
                                    <ChevronRight size={28} />
                                </div>
                                {/* Replaced SVG with image asset */}
                                <div className="absolute right-0 bottom-0 opacity-40 overflow-hidden">
                                    <img
                                        src="/src/assets/knight.png"
                                        alt="Chess Background"
                                        className="h-96 w-auto object-cover object-top sm:h-72"
                                    />
                                </div>
                            </div>

                            {/* Right column with Blitz and Classic stacked */}
                            <div className="col-span-12 lg:col-span-6 grid grid-rows-2 gap-6">
                                <div
                                    className="bg-[#4CAF50] rounded-lg p-6 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handleGameModeClick('BLITZ')}
                                >
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-bold mb-3">Blitz</h2>
                                        <p className="text-lg opacity-90">Fast-paced 5-minute games to test your speed!</p>
                                    </div>
                                    <div className="absolute bottom-6 right-6 bg-black bg-opacity-20 rounded-full p-3">
                                        <ChevronRight size={28} />
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-40 overflow-hidden">
                                        <img
                                            src="/src/assets/rook.png"
                                            alt="Chess Background"
                                            className="w-36 h-40 object-cover object-top"
                                        />
                                    </div>

                                </div>
                                <div
                                    className="bg-[#FFEB3B] rounded-lg p-6 relative overflow-hidden text-black cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handleGameModeClick('BULLET')}
                                >
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-bold mb-3">Bullet</h2>
                                        <p className="text-lg opacity-90">Super-fast chess with only 1 minute per player!</p>
                                    </div>
                                    <div className="absolute bottom-6 right-6 bg-black bg-opacity-20 rounded-full p-3">
                                        <ChevronRight size={28} className="text-black" />
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-40 overflow-hidden">
                                        <img
                                            src="/src/assets/queen.png"
                                            alt="Chess Background"
                                            className="w-36 h-40 object-cover object-top"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Private Chess Room - spans full width */}
                            <div
                                className="col-span-12 bg-[#9C27B0] rounded-lg p-6 relative overflow-hidden h-48 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={handlePrivateRoomClick}
                            >
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-3">Private Chess Room</h2>
                                    <p className="text-lg opacity-90">Create a game, and invite your friends to battle it out!</p>
                                </div>
                                <div className="absolute bottom-6 right-6 bg-black bg-opacity-20 rounded-full p-3">
                                    <ChevronRight size={28} />
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-20">
                                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Tournaments" && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Tournaments</h2>
                                <p className="text-gray-400">No active tournaments at the moment.</p>
                                <p className="text-gray-400">Check back later for upcoming events!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "Learn" && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Chess Learning Center</h2>
                                <p className="text-gray-400">Tutorials and lessons coming soon.</p>
                                <p className="text-gray-400">Master your chess skills with our guided lessons.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "Leaderboard" && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Global Leaderboard</h2>
                                <p className="text-gray-400">Top players will be displayed here.</p>
                                <p className="text-gray-400">Compete to see your name at the top!</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showPrivateDialog && <PrivateRoomDialog  onClose={() => setShowPrivateDialog(false)}  onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom}/>}
        </div>
    );
}

export default HomePage;
