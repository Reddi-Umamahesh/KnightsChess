import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
// import { useGameContext } from '../context/GameContext';

interface PrivateRoomDialogProps {
    onClose: () => void;
}

const PrivateRoomDialog: React.FC<PrivateRoomDialogProps> = ({ onClose }) => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    // const { setGameMode, setRoomId: setContextRoomId } = useGameContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            // setGameMode('private');
            // setContextRoomId(roomId);
            // onClose();
            navigate('/chessboard');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-white">Join Private Room</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                            Enter Room ID
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., room-123"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Join Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrivateRoomDialog;