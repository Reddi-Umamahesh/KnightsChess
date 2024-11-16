import useScreenSize from '@/hooks/ScreenSIze';
import React from 'react'

const ChessBoard: React.FC = () => {
    const isB = false;
    const { width } = useScreenSize();
      let w = 64; 
      if (width < 1200) {
        const drop = Math.floor((1200 - width) / 100); 
        w = 64 - drop * 4;
    }
    if (width <= 400) {
        console.log("howwdy");
        w = 40;
    }
    if (width <= 500 && width >= 400) {
        console.log("hey");
        w = 44
    }
    if (width <= 900 && width >= 800) {
        w = 56
    }
    if (width <= 800 && width >= 500) {
        console.log("hi")
        w = 56;
    }
    const dim = String(w) + "px"
    const dims = String(w * 8) + "px";
    console.log(dim, dims, w, width);
    const board = [];
    if (isB) {
        for (let i = 1; i <= 8; i++) {
          for (let j = 8; j >= 1; j--) {
            const n1 = String.fromCharCode(96 + j);
            const n2 = String(i);
            const k = n1 + n2;
            board.push(k);
          }
        }
    } else {
        for (let i = 8; i >= 1; i--) {
          for (let j = 1; j <= 8; j++) {
            const n1 = String.fromCharCode(96 + j);
            const n2 = String(i);
            const k = n1 + n2;
            board.push(k);
          }
        }
    }
    
    
  return (
    <div>
      <div
        className={`grid grid-rows-8 grid-cols-8   rounded-lg overflow-hidden `}
        style={{
          width: dims, 
          height: dims, 
        }}
      >
        {board.map((coordinate, index) => {
          const isDarkSquare = (Math.floor(index / 8) + index) % 2 === 0;

          return (
            <div
              key={coordinate}
              className={`flex items-center justify-center  text-sm font-medium ${
                isDarkSquare ? "bg-white text-black" : "bg-green-700 text-black"
              }`}
              style={{
                width: dim,
                height: dim,
              }}
            >
              {coordinate}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChessBoard