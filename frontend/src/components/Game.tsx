import React from 'react'
import ChessBoard from './ChessBoard'

const Game:React.FC = () => {
  return (
    <div className=' w-full grid cust960:grid-cols-9  grid-cols-1 text-white sm:px-20 px-5  py-4 gap-5  h-screen'>
      
      <div className=' col-span-5 border border-white   sm:p-12 p-6 flex items-center justify-center'><ChessBoard/> </div>
      <div className='col-span-3 border border-white bg-[#00000024]'>info box</div>
      <div className='col-span-1 '></div>
    </div>
  )
}

export default Game