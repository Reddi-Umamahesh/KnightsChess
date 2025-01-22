

import { BaseUserInterface } from '@/utils/constants';
import React, { useEffect, useRef, useState } from 'react'


interface props{
  player: BaseUserInterface | null | undefined,  
  height: string
  width: string
  isBlack: boolean
  isActive : boolean
  
}
const PlayerInfo: React.FC<props> = ({ player, height, width, isBlack , isActive }) => {
  const [time, setTimer] = useState<number>(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
    const changeCSSValue = (value: string,number:number ) => {
      const regex = /^(\d+)(\D+)$/;
      const match = value.match(regex);
      if (match) {
        const numberValue = parseInt(match[1], 10);
        const unit = match[2];
        return `${numberValue * number}${unit}`;
      }
      return value;
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  };
  const startTimer = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
  }
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    }
  }, [isActive]);

  return (
    <div
      className=" justify-between text-white p-2 content-center  overflow-hidden flex "
      style={{ height: height, width: width }}
    >
      <div className="flex gap-3 text-center">
        <img className="h-10 " src={"guest-user.jpg"} alt="" />
        {player?.username || "Guest_knight"}
      </div>
      <div
        className={`w-20 ${
          isBlack ? "bg-gray-950 text-slate-50" : "bg-white text-black"
        }  rounded-sm font-semibold   flex justify-center items-center  ${
          isActive ? "" : "opacity-50"
        }`}
        style={{
          width: changeCSSValue(height, 2.5),
          fontSize: changeCSSValue(height, 0.6),
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  );
}

export default PlayerInfo