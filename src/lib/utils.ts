import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {customAlphabet} from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDev() {
  return process.env.NODE_ENV === "development";
}

export function randomNanoID() {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 9);
  return nanoid();
}