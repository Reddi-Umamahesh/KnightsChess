import React from 'react'
import { Button } from '../ui/button';
import { useSocket } from '@/hooks/useSocket';
import { INIT_GAME } from '@/utils/constants';
import { useRecoilValue } from 'recoil';
import {  userState } from '@/recoil/userAtoms';
import { FaChessBoard } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getJWTTOKENFromLocalStorage } from '@/lib/utils';


const UtiliyBox: React.FC = () => {
  const token = getJWTTOKENFromLocalStorage();
  const user = useRecoilValue(userState);
  console.log(user)
    if (token == null) {
        return <div>...connecting</div>
    }
    const socket = useSocket(token)
  return (
    <div>
      <div className=" h-full w-full min-h-64   bg-[#00000024] flex pt-2">
        <Tabs defaultValue="newgame" className="w-full h-full">
          <TabsList className="w-full justify-between px-3 bg-[] grid grid-cols-3">
            <TabsTrigger className="gap-1" value="newgame">
              <FaRegPlusSquare /> New Game
            </TabsTrigger>
            <TabsTrigger className="gap-1" value="games">
              <FaChessBoard /> Games
            </TabsTrigger>
            <TabsTrigger value="players">
              {" "}
              <FaUsers />
              Players
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className="p-6 flex items-center justify-center "
            value="newgame"
          >
            <Button
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
              }}
              className="w-64 h-12  text-2xl bg-green-700 hover:bg-green-800 font-semibold"
            >
              Play
            </Button>
          </TabsContent>
          <TabsContent className="p-6" value="games">
            Change your password here.
          </TabsContent>
          <TabsContent className="p-6" value="players">
            Change your email here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UtiliyBox