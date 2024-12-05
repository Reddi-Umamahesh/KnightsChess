import { BaseUserInterface, USER_TOKEN } from "@/utils/constants";
import { atom } from "recoil";
import { jwtDecode } from "jwt-decode";
let userFromStorage: BaseUserInterface | null = null
const token = localStorage.getItem(USER_TOKEN);
console.log("changed", token)

if (token) {
    userFromStorage = jwtDecode(token) || null
    console.log(userFromStorage,"|")
}



export const userState = atom<BaseUserInterface | null>({
    key: 'userState',
    default : userFromStorage
})