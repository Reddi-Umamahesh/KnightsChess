import { BaseUserInterface, USER_TOKEN } from "@/utils/constants";
import { atom } from "recoil";
import { jwtDecode } from "jwt-decode";
let userFromStorage: BaseUserInterface | null = null
const token = localStorage.getItem(USER_TOKEN);

if (token) {
    userFromStorage = jwtDecode(token) || null
}

export const authState = atom<String | null>({
    key: 'authState',
    default: localStorage.getItem(USER_TOKEN) || null
})


export const userState = atom<BaseUserInterface | null>({
    key: 'userState',
    default : userFromStorage
})