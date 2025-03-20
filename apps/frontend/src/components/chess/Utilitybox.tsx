import { Move } from "chess.js";
import { Flag  , Handshake} from "lucide-react";

type ResignGame = () => void;
type DrawOffer = () => void;
type UtilityProps = {
  moves: Move[];
  resignGame: ResignGame;
  offerDraw: DrawOffer;
};

const UtilityBox: React.FC<UtilityProps> = ({  moves , resignGame , offerDraw }) => {
 
  return (
    <div className="w-full lg:w-80 bg-gray-800/50 rounded-lg p-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={offerDraw}
          className="flex flex-col items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 active:scale-95 active:bg-blue-700 rounded-lg text-white transition duration-200 ease-out">
          <Handshake className="w-5 h-5 mb-1" />
          <span className="text-xs">Draw</span>
        </button>
        <button
          onClick={resignGame}
          className="flex flex-col items-center justify-center p-2 bg-red-600 hover:bg-red-500 active:scale-95 active:bg-red-700 rounded-lg text-white transition duration-200 ease-out">
          <Flag className="w-5 h-5 mb-1" />
          <span className="text-xs">Resign</span>
        </button>
      </div>

      {/* Moves List */}
      <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-gray-100 font-bold mb-4">Move History</h3>
        <div className="space-y-2">
          {moves.map((move, index) => {
            const isWhite = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${isWhite ? "bg-gray-700/50" : "bg-gray-800/50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-mono">{index + 1}.</span>
                  <span className="text-gray-100">
                    {isWhite ? "White" : "Black"} {move.from} - {move.to}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UtilityBox;
