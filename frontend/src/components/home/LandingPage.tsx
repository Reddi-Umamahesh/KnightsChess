import React from 'react'
import { Button } from '../ui/button'
import img from '../../assets/chessboard.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { guest_api_endpoint } from '@/utils/constants';

const LandingPage: React.FC = () => {
  
  const navigate = useNavigate();
  const handleClick = async () => {
    const url = guest_api_endpoint + '/create-guest';
    try {
      const response= await axios.get(url)
      const token = response.data.token
      console.log(token)
      navigate('/game', { state: { token } })
    } catch (e) {
      console.log(e)
    }
    
  }
    
  return (
    <div className="h-screen py-5 px-24 grid sm:grid-cols-2 grid-cols-1 gap-5">
      <div className="sm:flex hidden  items-center  justify-center ">
        <img src={img} alt="" />
      </div>
      <div className="flex items-center justify-center flex-wrap text-white pb-10">
        <div className="text-white text-4xl font-bold mt-10">
          Play Chess Online on the #2 site!
        </div>

        <div className="w-full flex items-center justify-center mb-10 flex-col gap-5">
          <Button
            onClick={() => {
              handleClick();
            }}
            className="w-96 h-20  text-2xl bg-green-700 hover:bg-green-800 font-semibold"
          >
            {"Continue as Guest"}
          </Button>
          <Button
            onClick={() => {
              navigate("/game");
            }}
            className="w-96 h-20 text-2xl bg-blue-700 hover:bg-blue-800 font-semibold"
          >
            {"Signup / login"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage