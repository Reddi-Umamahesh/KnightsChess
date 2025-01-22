
import { BaseUserInterface, USER_TOKEN } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import { atom } from "recoil";

const token = localStorage.getItem(USER_TOKEN);
console.log("changed", token)

const userFromStorage: BaseUserInterface | null = token ? jwtDecode(token) : null;

export const userState = atom<BaseUserInterface | null>({
    key: 'userState',
    default : userFromStorage
})