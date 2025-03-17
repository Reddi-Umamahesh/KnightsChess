
import { BaseUserInterface, USER_TOKEN } from "../utils/constants";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type AuthState = {
    isAuthenticated: boolean,
    user : BaseUserInterface | null
}
export const authState = atom<AuthState>({
  key: "authState",
  default: { isAuthenticated: false, user: null },
  effects_UNSTABLE: [persistAtom],
});

export const tokenState = atom<string | null>({
  key: "tokenState",
  default: localStorage.getItem(USER_TOKEN) || null,
  effects_UNSTABLE: [persistAtom],
});
