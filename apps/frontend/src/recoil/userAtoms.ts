
import { jwtDecode } from "jwt-decode";
import { BaseUserInterface, USER_TOKEN } from "../utils/constants";
import { atom } from "recoil";

const token = localStorage.getItem(USER_TOKEN);
if (token) {
    const d = jwtDecode(token)
    console.log(d)
}
console.log("changed", token)



type AuthState = {
    isAuthenticated: boolean,
    user : BaseUserInterface | null
}
export const authState = atom<AuthState>({
    key: 'authState',
    default: { isAuthenticated: false , user : null}
})

export const tokenState = atom<string | null>({
    key: "tokenState",
    default: localStorage.getItem(USER_TOKEN) || null
});
