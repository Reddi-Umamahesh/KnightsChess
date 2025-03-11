import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Trophy, 
    ChevronRight,
    Menu,
} from "lucide-react";
import { authState } from "@/recoil/userAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import handleLogout from "@/features/auth/Logout";
import useWebSocket from "@/hooks/useSocket";
import { toast } from "react-toastify";
import { GAME_ADDED, INIT_GAME } from "@/utils/constants";
import { Game as GameType } from "@/hooks/gameStore";
import { GameState } from "@/recoil/gameAtom";
import LoadingGame from "@/components/chess/LoadingGame";
import PrivateRoomDialog from '@/components/chess/PrivateRoomDialog';


function HomePage() {
    const [activeTab, setActiveTab] = useState('Play');
    const [showPrivateDialog, setShowPrivateDialog] = useState(false);
    const navigate = useNavigate();
    const [waitingForGame, setWaitingForGame] = useState(false);
    const auth = useRecoilValue(authState);
    const user = auth.user;
    const socket  = useWebSocket();
    const setGame = useSetRecoilState(GameState);




    useEffect(() => {
        console.log(socket)
        if (!socket) {
            console.log("WebSocket is not available")
            return;
        }
        console.log("continuing in the home page")

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                const msgType = message.type;
                if (msgType === GAME_ADDED) {
                    console.log("GAME_ADDED received – waiting for opponent...");
                    setWaitingForGame(true);
                } else if (msgType === INIT_GAME) {
                    console.log("INIT_GAME received – processing game and navigating");
                    const gameId = message.payload?.gameId;
                    const payload = message.payload;
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
                    setWaitingForGame(false);
                    navigate(`/game/${gameId}`);
                }
            } catch (error) {
                console.error("Error processing socket message:", error);
            }
        };

        socket.addEventListener("message", handleMessage);

    }, [socket]);

    if (waitingForGame) {
        return <LoadingGame />;
    }

    if (!socket) {
        return <LoadingGame/>;
    }


    const handleGameModeClick = (mode: 'bullet' | 'blitz' | 'classic') => {
        console.log("Requesting new game...");
        if (!socket) {
            toast.error("Connecting to server...");
            return;
        }
        console.log("Sending INIT_GAME message to server");
        socket.send(JSON.stringify({ type: INIT_GAME }));
    };


    const handlePrivateRoomClick = () => {
        setShowPrivateDialog(true);
    };

    return (
        <div>
            {/* Mobile header with menu */}
            <header className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                            <img
                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">Garreth</p>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></div>
                            <span className="text-sm">10,000</span>
                        </div>
                    </div>
                </div>
                <button className="text-white">
                    <Menu size={24} />
                </button>
            </header>

            {/* Main content */}
            <main className="px-4 pb-8">
                {/* Hero section */}
                <div className="flex justify-between items-start mb-6">
                    <div className="max-w-xs">
                        <h1 className="text-2xl font-bold mb-1">Be the new ChessMaster.</h1>
                        <p className="text-sm text-gray-300">Play challenges, battle with friends and enter tournaments!</p>
                    </div>
                    <div className="text-yellow-400">
                        <Trophy size={40} />
                    </div>
                </div>

                {/* Navigation tabs */}
                <div className="flex space-x-6 mb-6 border-b border-gray-800 pb-2 overflow-x-auto">
                    {['Play', 'Tournaments', 'Learn', 'Leaderboard'].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-2 ${activeTab === tab
                                    ? 'text-yellow-400 font-medium border-b-2 border-yellow-400'
                                    : 'text-gray-400'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'Play' && (
                    <div className="grid grid-cols-12 gap-4">
                        {/* Bullet mode - takes up left half */}
                        <div
                            className="col-span-12 md:col-span-6 bg-[#2196F3] rounded-lg p-5 relative overflow-hidden h-64 md:h-96 cursor-pointer"
                            onClick={() => handleGameModeClick('bullet')}
                        >
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold mb-2">Bullet</h2>
                                <p className="text-sm opacity-90">These two lines explains what each game is like.</p>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-full p-2">
                                <ChevronRight size={24} />
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-20">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
                                    <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" fill="currentColor" />
                                    <path d="M12 12C9.33 12 7 14.33 7 17H17C17 14.33 14.67 12 12 12Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>

                        {/* Right column with Blitz and Classic stacked */}
                        <div className="col-span-12 md:col-span-6 grid grid-rows-2 gap-4">
                            {/* Blitz mode */}
                            <div
                                className="bg-[#4CAF50] rounded-lg p-5 relative overflow-hidden h-40 md:h-44 cursor-pointer"
                                onClick={() => handleGameModeClick('blitz')}
                            >
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-2">Blitz</h2>
                                    <p className="text-sm opacity-90">These two lines explains what each game is like.</p>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-full p-2">
                                    <ChevronRight size={24} />
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-20">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 5L17.5 9H20V19H4V9H6.5L5 5H19ZM6.5 11H4.5V17H19.5V11H17.5L19 7H7L8.5 11H15.5L14 7H10L11.5 11H6.5Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>

                            {/* Classic mode */}
                            <div
                                className="bg-[#FFEB3B] rounded-lg p-5 relative overflow-hidden h-40 md:h-44 text-black cursor-pointer"
                                onClick={() => handleGameModeClick('classic')}
                            >
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold mb-2">Classic</h2>
                                    <p className="text-sm opacity-90">These two lines explains what each game is like.</p>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-full p-2">
                                    <ChevronRight size={24} className="text-black" />
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-20">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L8 6H16L12 2Z" fill="currentColor" />
                                        <path d="M9 7V13H15V7H9Z" fill="currentColor" />
                                        <path d="M8 14L6 17H18L16 14H8Z" fill="currentColor" />
                                        <path d="M5 18V22H19V18H5Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Private Chess Room - spans full width */}
                        <div
                            className="col-span-12 bg-[#9C27B0] rounded-lg p-5 relative overflow-hidden h-40 cursor-pointer"
                            onClick={handlePrivateRoomClick}
                        >
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold mb-2">Private Chess Room</h2>
                                <p className="text-sm opacity-90">Create a game, and invite your friends to battle it out!</p>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-full p-2">
                                <ChevronRight size={24} />
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-20">
                                <svg width="160" height="160" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tournaments Tab Content */}
                {activeTab === 'Tournaments' && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Tournaments</h2>
                            <p className="text-gray-400">No active tournaments at the moment.</p>
                            <p className="text-gray-400">Check back later for upcoming events!</p>
                        </div>
                    </div>
                )}

                {/* Learn Tab Content */}
                {activeTab === 'Learn' && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Chess Learning Center</h2>
                            <p className="text-gray-400">Tutorials and lessons coming soon.</p>
                            <p className="text-gray-400">Master your chess skills with our guided lessons.</p>
                        </div>
                    </div>
                )}

                {/* Leaderboard Tab Content */}
                {activeTab === 'Leaderboard' && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Global Leaderboard</h2>
                            <p className="text-gray-400">Top players will be displayed here.</p>
                            <p className="text-gray-400">Compete to see your name at the top!</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Private Room Dialog */}
            {showPrivateDialog && (
                <PrivateRoomDialog onClose={() => setShowPrivateDialog(false)} />
            )}
        </div>
    );
}

export default HomePage;