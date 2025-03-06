
import { Crown, Trophy, History, Plus, ChevronRight, Award, Brain, Users, TrendingUp, PlayCircle,  User } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useguestAuth } from '@/features/auth/guestAuth';

function LandingPage() {
    const navigate = useNavigate();
    const guestAuth = useguestAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-bold mb-1 pb-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300 ">
            KnightsChess
          </h1>
          <p className="text-2xl mb-8 text-gray-300">
            Challenge Minds, Master Strategy
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-lg transform transition hover:scale-105 flex items-center justify-center space-x-2 w-64 mx-auto"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Login to Play</span>
            </button>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2">
                <FaGoogle />
                <span>Google</span>
              </button>
              <button
                onClick={guestAuth}
                className="bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Continue as Guest</span>
              </button>
            </div>
            <p className="text-gray-400">
              New User?{" "}
              <a href="/signup" className="text-amber-500 hover:text-amber-400">
                Sign Up Here
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-amber-500 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold">Vishy anand</h3>
                <p className="text-gray-400">ELO: --</p>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-purple-700 hover:bg-purple-600 py-2 px-4 rounded-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    New Game
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Tournaments
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    History
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Center Area */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Crown className="w-6 h-6 mr-2 text-amber-500" />
                Featured Match
              </h2>
              <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                <p className="text-gray-400">Login to watch live matches</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-amber-500" />
                Learn Chess
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Basics</h3>
                  <p className="text-gray-400">Master the fundamentals</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Advanced</h3>
                  <p className="text-gray-400">Learn winning strategies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-amber-500" />
                Leaderboard
              </h2>
              <div className="space-y-3">
                {["magnus" ," vishy" , "pragg" , "gukesh" , "dina"].map((ele, pos) => (
                  <div
                    key={pos}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-amber-500">#{pos + 1}</span>
                      <span className="ml-2">{ele}</span>
                    </div>
                        <span className="text-amber-500">{450 * (5 - pos+1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-amber-500" />
                Daily Challenge
              </h2>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400">Login to access daily puzzles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
            <Users className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Join Clubs</h3>
            <p className="text-gray-400">Connect with players worldwide</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
            <TrendingUp className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Analyze Games</h3>
            <p className="text-gray-400">Improve your strategy</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-900/20">
            <Crown className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Tournaments</h3>
            <p className="text-gray-400">Compete for glory</p>
          </div>
        </div>
      </div>

      {/* Floating Login Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-purple-900/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-gray-400">
            <span className="text-amber-500 font-bold">1,234</span> games being
            played right now!
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg">
            Login to Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;