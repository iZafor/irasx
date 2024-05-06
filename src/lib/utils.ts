import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { StoredAuthData } from "./definition";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateStoredAuthData() {
  const data: string | null = localStorage.getItem("authData");
  if (data === null) {
    return false;
  }
  const authData: StoredAuthData = JSON.parse(data);
  const res = Date.parse(
    authData.data.data?.[0]?.["expires"] || (new Date()).toUTCString()) > Date.now();
  return res;
}