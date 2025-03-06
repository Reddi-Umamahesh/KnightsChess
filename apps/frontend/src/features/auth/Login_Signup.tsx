import React, { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  BaseUserInterface,
  user_api_endpoint,
  USER_TOKEN,
} from "../../utils/constants";
import { authState } from "../../recoil/userAtoms";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const res = await axios.post(
        `${user_api_endpoint}${endpoint}`,
        formData,
        { withCredentials: true }
      );
      console.log("response", res);
      if (res.data.success) {
        console.log("success");
        const decoded: BaseUserInterface = jwtDecode(res.data.token);
        console.log(decoded);
        setAuthState({
          isAuthenticated: true,
          user: {
            id: decoded.id,
            name: decoded.name,
            isGuest: decoded.isGuest,
          },
        });
        localStorage.setItem(USER_TOKEN, res.data.token);
        toast.success(res.data.message);
        console.log("navigating home");
        navigate("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4  bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-purple-900/20 bg-opacity-90">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300 mb-2">
            KnightsChess
          </h1>
          <p className="text-gray-400">
            {isLogin ? "Welcome back, player!" : "Join the chess community"}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-2 text-center ${
                isLogin
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isLogin
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-gray-400"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              <FaGoogle />
              <span className="ml-1"> Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              <User />
              <span>Continue as Guest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
