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
  const [currentPiece, setCurrentPiece] = useState(0);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const pieceInterval = setInterval(() => {
      setCurrentPiece((prev) => (prev + 1) % pieces.length);
    }, 1000);

    return () => clearInterval(pieceInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="relative flex flex-col items-center">
        {/* Rotating border effect */}
        <div className="absolute inset-0 rounded-lg">
          <div className="w-full h-full animate-spin">
            <div className="w-full h-full rounded-lg border-4 border-transparent border-t-amber-500 border-r-amber-500"></div>
          </div>
        </div>

        {/* Chess piece container */}
        <div className="w-24 h-24 bg-gray-800/80 rounded-lg flex items-center justify-center p-4 backdrop-blur-sm mb-3">
          <img
            src={pieces[currentPiece]}
            alt="Loading Chess Piece"
            className="w-16 h-16 transition-opacity duration-300"
          />
        </div>

        {/* Message */}
        <p className="text-amber-500 font-semibold text-lg">{message}</p>

        {/* Button for navigation */}
        {link.length > 2 && (
          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all group"
            >
              <Home className="mr-2 group-hover:animate-pulse" />
              <span>Back to Home</span>
              <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <p className="text-gray-400 mt-2 text-sm">
              Auto-redirecting in {countdown} seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingGame;
