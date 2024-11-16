import React from 'react'
import { Button } from '../ui/button'
import img from '../../assets/chessboard.jpg';
import { useNavigate } from 'react-router-dom';
const LandingPage: React.FC = () => {
    const navigate = useNavigate();
  return (
      <div className='h-screen py-5 px-24 grid sm:grid-cols-2 grid-cols-1 gap-5'>
          <div className='sm:flex hidden  items-center  justify-center '><img src={img} alt="" /></div>
          <div className='flex items-center justify-center flex-wrap text-white pb-10' >
              <div className='text-white text-4xl font-bold mt-10'>Play Chess Online on the #2 site!</div>
              
              <div className='w-full flex items-center justify-center mb-10'>
                  <Button onClick={() => {
                      navigate("/game")
                  }}  className='w-96 h-20  text-2xl bg-green-700 hover:bg-green-800 font-semibold'> Play Online </Button>
                  
              </div>
          </div>
      </div>
  )
}

export default LandingPage