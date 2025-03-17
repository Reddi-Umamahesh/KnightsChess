import  React, { useEffect, useState } from "react";

const pieces = ["p", "k", "r", "q", "k", "b"].map(
  (piece) => `/pieces/${piece}.png`
);
interface LoadingGameProps {
  message: string;
}
const LoadingGame: React.FC<LoadingGameProps> = ({message}) => {
  const [currentPiece, setCurrentPiece] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPiece((prev) => (prev + 1) % pieces.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[] flex items-center justify-center bg-opacity-80">
      <div className="relative">
        {/* Rotating border effect */}
        <div className="absolute inset-0 rounded-lg">
          <div className="w-full h-full animate-spin">
            <div className="w-full h-full rounded-lg border-4 border-transparent border-t-amber-500 border-r-amber-500"></div>
          </div>
        </div>

        {/* Chess piece container */}
        <div className="w-24 h-24 bg-gray-800/80 rounded-lg flex items-center justify-center p-4 backdrop-blur-sm">
          <img
            src={pieces[currentPiece]}
            alt="Loading Chess Piece"
            className="w-16 h-16 transition-opacity duration-300"
          />
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-amber-500 font-semibold">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingGame;
