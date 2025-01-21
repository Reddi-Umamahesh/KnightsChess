import {  USER_TOKEN } from "../utils/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getJWTTOKENFromLocalStorage = () => {
  return localStorage.getItem(USER_TOKEN)
}