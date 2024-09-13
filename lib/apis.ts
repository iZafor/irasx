"use server";

import {
    GradesResponse,
    OfferedCourse,
    PrerequisiteCourse,
    CourseCatalogue,
    RequirementCatalogue,
} from "./definition";
import { verifySession } from "./dal";
import { formatTimeSlot } from "./utils";

export async function getGrades() {
    const { studentId, accessToken } = await verifySession();

    try {
        const res: GradesResponse = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/student-registered-courses/${studentId}/all`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
            }
        ).then((res) => res.json());
        return res;
    } catch (error) {
        console.error(error);
    }
    return { data: [], total: 0 };
}

export async function getOfferedCourses() {
    const { studentId, accessToken } = await verifySession();

    try {
        const res: {
            data: { eligibleOfferCourses: OfferedCourse[] };
            success: boolean;
        } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${studentId}/all-offer-courses`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
            }
        ).then((res) => res.json());
        return res.data.eligibleOfferCourses.map((course) => {
            course.timeSlot = formatTimeSlot(course.timeSlot);
            return course;
        });
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getPrerequisiteCourses() {
    const { studentId, accessToken } = await verifySession();

    try {
        const res: {
            data: PrerequisiteCourse[];
            message: string;
            total: number;
        } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${studentId}/pre-requisite-courses`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
            }
        ).then((res) => res.json());
        return res.data;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getCourseCatalogue(catalogue: string) {
    const { studentId, accessToken } = await verifySession();
    
    try {
        const res: { data: CourseCatalogue[] } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/common/catalouge-details/${studentId}/${catalogue}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
            }
        ).then((res) => res.json());
        return res.data;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getRequirementCatalogues() {
    const { studentId, accessToken } = await verifySession();

    try {
        const res: { data: RequirementCatalogue[] } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/student-catelogue-requirment/${studentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
            }
        ).then((res) => res.json());
        return res.data;
    } catch (error) {
        console.error(error);
    }
    return [];
}
