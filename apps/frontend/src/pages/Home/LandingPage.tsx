
import { PlayCircle,  User } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useguestAuth } from '@/features/auth/guestAuth';
import { useState } from 'react';

function LandingPage() {
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();
  const guestAuth = useguestAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[92vh] flex items-center justify-center">
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
              {/* <button className="bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2">
                <FaGoogle />
                <span>Google</span>
              </button> */}
              <button
                onClick={() => {guestAuth({setLoading})}}
                className="bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
                disabled = {loading}
              >
                {loading ? (
                <div className='spinner'></div>
                ): (
                    <><User className="w-5 h-5" />
                      <span>Continue as Guest</span></>
                )}
                
              </button>
            </div>
            <p className="text-gray-400">
              New User?{" "}
              <a href="/login" className="text-amber-500 hover:text-amber-400">
                Sign Up Here
              </a>
            </p>
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
          <button onClick={() => navigate("/login")}  className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-6 rounded-lg">
            Login to Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;