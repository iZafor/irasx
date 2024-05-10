import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    StoredAuthData,
    Result,
    SemesterOrder,
    SemesterResult,
    STORED_AUTH_DATA_KEY,
    PreRequisiteCourse,
    PreRequisiteMap,
    RequirementCatalogue,
    RequirementCatalogueMap,
    OfferedCourse,
} from "./definition";
import { BinaryTree } from "./binary-tree";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateStoredAuthData(authData: StoredAuthData) {
    if (authData.data === undefined) {
        return false;
    }
    const res =
        Date.parse(
            authData.data.data?.[0]?.["expires"] || new Date().toUTCString()
        ) > Date.now();
    return res;
}

export function getStoredAuthData(): StoredAuthData {
    return JSON.parse(localStorage.getItem(STORED_AUTH_DATA_KEY) || "{}");
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
            if (tempResult[year].keys.find((s) => s === sem) === undefined) {
                tempResult[year].keys.push(sem);
            }
            tempResult[year][sem] = [arr[i]];
        } else {
            tempResult[year][sem].push(arr[i]);
        }
    }
    tempResult.keys.sort((a, b) => a - b);
    tempResult.keys.forEach((key) => {
        tempResult[key].keys.sort(
            (a, b) => SemesterOrder[a - 1] - SemesterOrder[b - 1]
        );
    });
    return tempResult;
}

export function transformIntoPreRequisiteMap(arr: PreRequisiteCourse[], offeredCourses: OfferedCourse[]) {
    const res: PreRequisiteMap = {};
    const tree = new BinaryTree();

    for (const course of offeredCourses) {
        tree.insert(course.courseId);
    }

    for (const course of arr) {
        if (tree.find(course.preReqCourseId)) {
            if (!res[course.courseId]) {
                res[course.courseId] = {
                    preRequisites: [
                        {
                            courseId: course.preReqCourseId,
                            status: course.gradePoint ? "complete" : "incomplete",
                        },
                    ],
                };
            } else {
                res[course.courseId].preRequisites.push({
                    courseId: course.preReqCourseId,
                    status: course.gradePoint ? "complete" : "incomplete",
                });
            }
        }
    }

    return res;
}

export function transformIntoRequirementCatalogueMap(
    arr: RequirementCatalogue[]
) {
    const res: RequirementCatalogueMap = {};
    for (const catalogue of arr) {
        const entry = res[catalogue.courseGroupName];
        if (!entry) {
            res[catalogue.courseGroupName] = {
                minRequirement: Number(catalogue.minRequirment),
                maxRequirement: Number(catalogue.maxRequirment),
                doneCredit: Number(catalogue.doneCredit),
            };
        } else {
            entry.minRequirement += Number(catalogue.minRequirment);
            entry.maxRequirement += Number(catalogue.maxRequirment);
            entry.doneCredit += Number(catalogue.doneCredit);
        }
    }
    return res;
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
            return "Winter";
        case "2":
            return "Spring";
        case "3":
            return "Summer";
        default:
            return "";
    }
}

export function arrayOfSize(size: number) {
    return Array.from({ length: size }, () => 0);
}

export function formatTimeSlot(timeStr: string) {
    const splitted = timeStr.split(" ");
    const times = splitted[1].split("-");
    const startHour = Number(times[0].substring(0, 2));
    const endHour = Number(times[1].substring(0, 2));

    times[0] = startHour < 13 ? `${startHour}:${times[0].substring(2)}` : `${startHour - 12}:${times[0].substring(2)}`;
    times[1] = endHour < 13 ? `${endHour}:${times[1].substring(2)}` : `${endHour - 12}:${times[1].substring(2)}`;

    times[0] += startHour < 12 ? "AM" : "PM";
    times[1] += endHour < 12 ? "AM" : "PM";

    return `${splitted[0]} ${times.join("-")}`;
}
