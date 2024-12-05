import React from 'react'
import { Button } from '../ui/button'
// import img from '../../assets/chessboard.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUserInterface, guest_api_endpoint, USER_TOKEN } from '@/utils/constants';
import { jwtDecode } from "jwt-decode";
import {  useSetRecoilState } from 'recoil';

import {userState } from '@/recoil/userAtoms';


const LandingPage: React.FC = () => {

  
  const setUser = useSetRecoilState(userState);
  console.log(localStorage.getItem("authToken"))
  const navigate = useNavigate();
  const handleClick = async () => {

    console.log("from here!! guest button")
    const url = guest_api_endpoint + '/create-guest';
    try {
      const response= await axios.get(url)
      const token = response.data.token  
      const decoded = jwtDecode(token);
      const decodedUser: BaseUserInterface = {
        //@ts-ignore
        userId: decoded.userId,
        //@ts-ignore
        username: decoded.name,
      };
      setUser(decodedUser)
      localStorage.setItem(USER_TOKEN, token)
      navigate('/game')

    } catch (e) {
      console.log(e)
    }
    
  }
    
  return (
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
            onClick={() => {
              handleClick();
            }}
            className="lg:w-96 h-20 p-10 text-2xl bg-green-700 hover:bg-green-800 font-semibold"
          >
            {"play as Guest"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage