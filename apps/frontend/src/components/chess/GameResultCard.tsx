import React from 'react';
import { Trophy , X, Flag} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameResultCardProps {
    winner?: string;
    loser?: string,
    result : "WIN" | "LOSE" | "DRAW";
    eloChange?: number;
    cause? : string ,
    onPlayAgain?: () => void;
    onBackToHome?: () => void;
    onClose?: () => void;
}


const GameResultCard: React.FC<GameResultCardProps> = ({
    winner,
    result,
    cause,
    onClose,
}) => {
    const navigate = useNavigate();
    const getHeaderGradient = () => {
        switch (result) {
            case 'WIN':
                return 'bg-gradient-to-b from-emerald-500/90 via-emerald-500/50 to-transparent';
            case 'LOSE':
                return 'bg-gradient-to-b from-red-500/90 via-red-500/50 to-transparent';
            case 'DRAW':
                return 'bg-gradient-to-b from-yellow-500/90 via-yellow-500/50 to-transparent';
            default:
                return '';
        }
    };

    const getIcon = () => {
        switch (result) {
            case 'WIN':
                return <Trophy size={48} className="text-emerald-500" />;
            case 'LOSE':
                return <Flag size={48} className="text-red-500" />;
            case 'DRAW':
                return <div className="text-4xl">🤝</div>;
        }
    };

    const getMessage = () => {
        switch (result) {
            case 'WIN':
                return 'Congratulations on your victory!';
            case 'LOSE':
                return 'Better luck next time!';
            case 'DRAW':
                return 'A well-fought game by both players!';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
                {/* Gradient Header - Increased height to 35% of card */}
                <div className={`h-32 relative ${getHeaderGradient()}`}>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 -mt-16">
                    {/* Result Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`w-20 h-20 rounded-full ${result === 'WIN' ? 'bg-emerald-500/20' :
                                result === 'LOSE' ? 'bg-red-500/20' :
                                    'bg-yellow-500/20'
                            } flex items-center justify-center`}>
                            {getIcon()}
                        </div>
                    </div>

                    {/* Result Text */}
                    <div className="text-center mb-8">
                        <h2 className='text-2xl font-bold text-white mb-2'>{cause}</h2>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {result === 'DRAW' ? "It's a Draw!" : `${winner} Wins!`}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {getMessage()}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate("/home")}
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => navigate("/home")}
                            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameResultCard;