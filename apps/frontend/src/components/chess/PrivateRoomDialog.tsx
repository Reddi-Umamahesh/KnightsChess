import React, { useState } from 'react';
import { X, Users, Plus } from 'lucide-react';
import { GAME_MODE } from '@/utils/constants';

interface PrivateRoomDialogProps {
    onClose: () => void;
    onCreateRoom: (mode :GAME_MODE) => void;
    onJoinRoom: (roomId: string) => void;
}

const PrivateRoomDialog: React.FC<PrivateRoomDialogProps> = ({ onClose , onCreateRoom , onJoinRoom }) => {
    const [mode, setMode] = useState<'select' | 'join' | 'create'>('select');
    const [roomId, setRoomId] = useState('');
    const [selectedVariant, setSelectedVariant] = useState<GAME_MODE>('RAPID');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                {mode === 'select' && (
                    <>
                        <h2 className="text-xl font-bold mb-6 text-white">Private Chess Room</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setMode('join')}
                                className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <Users size={32} className="mb-3 text-purple-400" />
                                <span className="text-white font-medium">Join Room</span>
                            </button>
                            <button
                                onClick={() => setMode('create')}
                                className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <Plus size={32} className="mb-3 text-purple-400" />
                                <span className="text-white font-medium">Create Room</span>
                            </button>
                        </div>
                    </>
                )}

                {mode === 'join' && (
                    <>
                        <h2 className="text-xl font-bold mb-4 text-white">Join Private Room</h2>
                        <form onSubmit={() => onJoinRoom(roomId)}>
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

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode('select')}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    Join Room
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {mode === 'create' && (
                    <>
                        <h2 className="text-xl font-bold mb-4 text-white">Create Private Room</h2>
                        <form onSubmit={() => onCreateRoom(selectedVariant)}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Game Variant
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['RAPID', 'BULLET', 'BLITZ',] as const).map((variant) => (
                                        <button
                                            key={variant}
                                            type="button"
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-md capitalize text-sm font-medium transition-colors ${selectedVariant === variant
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                        >
                                            {variant}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode('select')}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    Create Room
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PrivateRoomDialog;