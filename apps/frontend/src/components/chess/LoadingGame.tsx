import { ArrowRight, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const pieces = ["p", "k", "r", "q", "k", "b"].map(
  (piece) => `/pieces/${piece}.png`
);

interface LoadingGameProps {
  message: string;
  link: string;
}

const LoadingGame: React.FC<LoadingGameProps> = ({ message, link }) => {
  const navigate = useNavigate();
  const [currentPiece, setCurrentPiece] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPiece((prev) => (prev + 1) % pieces.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  <div className="w-24 h-24 bg-gray-800/80 rounded-lg flex items-center justify-center p-4 backdrop-blur-sm mb-3">
  
  </div>
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="relative flex flex-col items-center">
        {/* Loading animation container */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-600/20" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600"
            style={{
              animation: "spin 1.5s linear infinite"
            }}
          />

          {/* Chess piece */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl text-purple-400">
              <img
                src={pieces[currentPiece]}
                alt="Loading Chess Piece"
                className="w-16 h-16 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
        {/* Message */}
        <p className="text-purple-400 font-semibold text-lg mb-2">{message}</p>

        {/* Navigation button */}
        {link.length > 2 && (
          <div className="mt-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all group"
            >
              <Home className="mr-2 group-hover:animate-pulse" />
              <span>Back to Home</span>
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingGame;
