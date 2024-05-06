import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { StoredAuthData, Result, SemesterOrder, SemesterResult } from "./definition"

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

export function getStoredAuthData(): StoredAuthData {
  return JSON.parse(localStorage.getItem("authData") || "{}")
}

export function transformIntoResult(arr: SemesterResult[]) {
  const tempResult: Result = { keys: [] };
  for (let i = 0; i < arr.length; i++) {
    const year = Number(arr[i].regYear);
    const sem = Number(arr[i].regSemester);
    if (!tempResult[year]) {
      tempResult.keys.push(year);
      tempResult[year] = { keys: [] };
    }

    if (!tempResult[year][sem]) {
      if (tempResult[year].keys.find(s => s === sem) === undefined) {
        tempResult[year].keys.push(sem);
      }
      tempResult[year][sem] = [arr[i]];
    } else {
      tempResult[year][sem].push(arr[i]);
    }
  }
  tempResult.keys.sort((a, b) => a - b);
  tempResult.keys.forEach(key => {
    tempResult[key].keys.sort((a, b) => SemesterOrder[a - 1] - SemesterOrder[b - 1]);
  });
  return tempResult;
}

export function mapGradePoint(grade: string) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.3;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.3;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.3;
    case "D":
      return 1.0;
    default:
      return 0.0;
  }
}

export function mapSemester(semester: string) {
  switch (semester) {
    case "1":
      return "Winter"
    case "2":
      return "Spring"
    case "3":
      return "Summer"
    default:
      return "";
  }
}