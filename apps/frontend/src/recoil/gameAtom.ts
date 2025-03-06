import { Game } from "@/hooks/gameStore";

import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface Payload {
  gameId: string | null;
  game: Game | null;
}

const { persistAtom } = recoilPersist();

export const GameState = atom<Payload>({
  key: "gameState",
  default: {
    gameId: null,
    game: null,
  },
  effects_UNSTABLE: [persistAtom],
});
