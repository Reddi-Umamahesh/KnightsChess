
import { atom } from "recoil";

export interface GuestUser{
    userId: string,
    name: string,
    iat: number,
    exp: number,
}
const token = localStorage.getItem('guestToken');
let userFromStorage: GuestUser | null = null;
if (token) {
  const user = localStorage.getItem("guestUser");
  if (user != 'undefined') {
    try {
      userFromStorage = user ? JSON.parse(user) : null
        
    } catch (e) {
      console.error(e)
      }
  }
}

export const guestUserToken = atom({
  key: 'guestUserToken',
  default: localStorage.getItem('guestToken') || null
})

export const guestUser = atom<GuestUser | null>({
  key: "guestUser",
  default: userFromStorage || null,
});