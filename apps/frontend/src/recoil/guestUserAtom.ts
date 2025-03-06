// import { jwtDecode } from "jwt-decode";
// import { atom } from "recoil";

export interface GuestUser {
  id: string;
  name: string;
  iat: number;
  exp: number;
}
// const token = localStorage.getItem('guestToken');
// let userFromStorage: GuestUser | null = null;
// if (token) {
//   const decoded = jwtDecode(token) || null;
//   console.log("localst")
//   console.log(decoded)
//   const user = localStorage.getItem("guestUser");

//   if (user != 'undefined') {
//     try {
//       userFromStorage = user ? JSON.parse(user) : null

//       console.log(userFromStorage)

//     } catch (e) {
//       console.error(e)
//       }
//   }
// }

// export const guestUserToken = atom({
//   key: 'guestUserToken',
//   default: localStorage.getItem('guestToken') || null
// })

// export const guestUser = atom<GuestUser | null>({
//   key: "guestUser",
//   default: userFromStorage || null,
// });
