
import { authState, tokenState } from "@/recoil/userAtoms";
import { user_api_endpoint } from "@/utils/constants";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PiHandWavingDuotone } from "react-icons/pi";
const Navbar = () => {
  const auth = useRecoilValue(authState);
  const setAuthState = useSetRecoilState(authState);
  const setTokenState = useSetRecoilState(tokenState)
  const handleLogout = async() => {
    // Remove the token from localStorage (adjust the key if needed)
    localStorage.removeItem("USER_TOKEN");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    const nagivate = useNavigate();
    // Update the auth state to log out the user
    try {
      const res = await axios.get(`${user_api_endpoint}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Logged out successfully");
      }
       setAuthState({
         isAuthenticated: false,
         user: null,
       });
      setTokenState(null)
       
      console.log(res);
      

      nagivate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data.message);
        } else {
          console.log("u1");
          toast.error("Unexpected error occured");
        }
      } else {
        console.log("u2");
        toast.error("Unexpected error occured");
      }
    }
   
    };
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold">
          Chess App
        </Link>
        <div className="space-x-4">
          <div>
            <span>
              {auth.user ? (
                <span>
                  <PiHandWavingDuotone /> {auth.user.username}
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
          <Link
            to="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/game"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Play
          </Link>
          {auth.isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;