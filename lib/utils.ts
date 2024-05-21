import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    StoredAuthData,
    Result,
    SemesterOrder,
    SemesterResult,
    STORED_AUTH_DATA_KEY,
    PrerequisiteCourse,
    PrerequisiteMap,
    RequirementCatalogue,
    RequirementCatalogueMap,
    OfferedCourse,
    Course,
    CourseCataloguePrimitive,
} from "./definition";
import { BinaryTree } from "./binary-tree";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function validateStoredAuthData(authData: StoredAuthData) {
    return (
        authData.authToken &&
        authData.expiry &&
        Date.parse(authData.expiry || new Date().toUTCString()) > Date.now()
    );
}

export function getStoredAuthData(): StoredAuthData {
    if (typeof localStorage === "undefined") {
        return JSON.parse("{}");
    }
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

export function transformIntoPrerequisiteMap(
    arr: PrerequisiteCourse[],
    offeredCourses: OfferedCourse[]
) {
    const res: PrerequisiteMap = {};
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
                            status: course.gradePoint != 0,
                        },
                    ],
                };
            } else {
                res[course.courseId].preRequisites.push({
                    courseId: course.preReqCourseId,
                    status: course.gradePoint != 0,
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

export function mapDay(day: string) {
    switch (day) {
        case "S":
            return "Sunday";
        case "M":
            return "Monday";
        case "T":
            return "Tuesday";
        case "W":
            return "Wednesday";
        case "R":
            return "Thursday";
        case "F":
            return "Friday";
        case "A":
            return "Saturday";
    }
}

export function formatTimeSlot(timeStr: string) {
    const [days, duration] = timeStr.split(" ");
    const times = duration.split("-");
    const startHour = Number(times[0].substring(0, 2));
    const endHour = Number(times[1].substring(0, 2));

    times[0] =
        startHour < 13
            ? `${startHour}:${times[0].substring(2)}`
            : `${startHour - 12}:${times[0].substring(2)}`;
    times[1] =
        endHour < 13
            ? `${endHour}:${times[1].substring(2)}`
            : `${endHour - 12}:${times[1].substring(2)}`;

    times[0] += startHour < 12 ? "AM" : "PM";
    times[1] += endHour < 12 ? "AM" : "PM";

    return `${days
        .substring(0, days.length - 1)
        .split("")
        .map(mapDay)
        .join(", ")} ${times.join("-")}`;
}

export function generateCourseArray(
    offeredCourses: OfferedCourse[],
    requirementCatalogues: RequirementCatalogue[],
    prerequisiteMap: PrerequisiteMap,
    catalogues: CourseCataloguePrimitive[]
) {
    const res: Course[] = [];
    for (const course of offeredCourses) {
        res.push({
            courseId: course.courseId,
            courseTitle: course.courseName,
            section: course.section,
            faculty: course.facualtyName,
            timeSlot: course.timeSlot,
            vacancy: `${course.vacancy}/${course.capacity}`,
            enrolled: course.enrolled,
            prerequisites:
                prerequisiteMap[course.courseId]?.preRequisites || [],
            grade: `${course.grade}(${course.gp})`,
            creditHour: course.creditHour,
            catalogue: catalogues
                .filter((cat) => cat.catalogId === course.catalogId)
                .map((cat) => cat.catalogName)
                .join(", "),
            group: requirementCatalogues
                .filter((cat) => cat.courseCatId === course.courseCategoryId)
                .map((cat) => cat.courseGroupName)
                .join(", "),
            category: requirementCatalogues
                .filter((cat) => cat.courseCatId === course.courseCategoryId)
                .map((cat) => cat.courseCatGroupName)
                .join(", "),
            type: requirementCatalogues
                .filter((cat) => cat.courseCatId === course.courseCategoryId)
                .map((cat) => cat.courseTypeName)
                .join(", "),
        });
    }

    return res;
}
