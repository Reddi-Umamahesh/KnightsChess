import React, { useEffect } from "react";
import { Button } from "../components/ui/button";
// import img from '../../assets/chessboard.jpg';
import { useNavigate } from "react-router-dom";
import { useguestAuth } from "@/auth/guestAuth";
import axios from "axios";
import { api_endpoint } from "@/utils/constants";
import { useSetRecoilState } from "recoil";
import { authState } from "@/recoil/userAtoms";



const LandingPage: React.FC = () => {

  const navigate = useNavigate();
  const guestAuth = useguestAuth();
  const setAuthState = useSetRecoilState(authState)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = api_endpoint + "/check-auth";
        const response = await axios.get(url, {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
          });
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }
    };
    checkAuth();
  } , [navigate , setAuthState])
  return (
    <div>
      <div className="min-h-screen py-5 px-24 grid sm:grid-cols-2 grid-cols-1 gap-5 bg-[url('/chess-bg.jpeg')] bg-cover">
        <div className="sm:flex hidden  items-center  justify-center ">
          {/* <img src={img} alt="" /> */}
        </div>
        <div className="flex items-center justify-center flex-wrap text-white pb-10">
          <div className="text-white text-4xl font-bold mt-10">
            Play Chess Online on the #2 site!
          </div>

          <div className="w-full flex items-center justify-center mb-10 flex-col gap-5 mt-[20%]">
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="lg:w-96 h-20 p-10 text-2xl bg-blue-700 hover:bg-blue-800 font-semibold"
            >
              {"Signup / login"}
            </Button>
            <Button
              onClick={guestAuth}
              className="lg:w-96 h-20 p-10 text-2xl bg-green-700 hover:bg-green-800 font-semibold"
            >
              {"play as Guest"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
