import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full relative">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=2000"
                        alt="Chess pieces"
                        className="w-full h-full object-cover object-center opacity-60"
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 p-8 md:p-12">
                    <div className="space-y-6 text-center">
                        <h1 className="text-7xl md:text-9xl font-bold text-white mb-4">404</h1>

                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-semibold text-purple-400">
                                Checkmate! This move led to a dead end
                            </h2>
                            <p className="text-gray-300 text-lg max-w-xl mx-auto">
                                Looks like you've wandered into unknown territory. Don't worry, even grandmasters make unexpected moves sometimes.
                            </p>
                        </div>

                        <div className="pt-4">
                                <button
                                    onClick={() => navigate('/home')}
                                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors group"
                                >
                                    <Home className="mr-2 group-hover:animate-pulse" />
                                    <span>Back to Home</span>
                                    <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <p className="text-gray-400 mt-4 text-sm">
                                    Auto-redirecting in {countdown} seconds...
                                </p>
                        </div>

                        {/* Chess Piece Decorations */}
                        <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 text-4xl opacity-20">♟</div>
                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-4xl opacity-20">♔</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;