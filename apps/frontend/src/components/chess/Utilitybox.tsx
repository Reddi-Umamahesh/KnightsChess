
import { MessageCircle, RotateCcw, Flag, Settings } from "lucide-react";

function UtilityBox() {
  const moves = [
    { piece: "P", from: "e2", to: "e4", time: "10:00" },
    { piece: "P", from: "e7", to: "e5", time: "9:55" },
    { piece: "N", from: "g1", to: "f3", time: "9:45" },
  ];

  return (
    <div className="w-full lg:w-80 bg-gray-800/50 rounded-lg p-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100">
          <RotateCcw className="w-5 h-5 mb-1" />
          <span className="text-xs">Undo</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100">
          <Flag className="w-5 h-5 mb-1" />
          <span className="text-xs">Resign</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100">
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Chat</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100">
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-xs">Settings</span>
        </button>
      </div>

      {/* Moves List */}
      <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-gray-100 font-bold mb-4">Move History</h3>
        <div className="space-y-2">
          {moves.map((move, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-mono">{index + 1}.</span>
                <span className="text-gray-100">
                  {move.piece} {move.from}-{move.to}
                </span>
              </div>
              <span className="text-gray-400 text-sm">{move.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-gray-700 rounded-lg py-2 px-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}

export default UtilityBox;
