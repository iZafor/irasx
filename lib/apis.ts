"use server";

import {
    GradesResponse,
    OfferedCourse,
    PrerequisiteCourse,
    CourseCatalogue,
    RequirementCatalogue,
} from "./definition";
import { formatTimeSlot } from "./utils";

export async function getGrades(id: string, authToken: string) {
    try {
        const res: GradesResponse = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/student-registered-courses/${id}/all`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
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

export async function getOfferedCourses(id: string, authToken: string) {
    try {
        const res: {
            data: { eligibleOfferCourses: OfferedCourse[] };
            success: boolean;
        } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${id}/all-offer-courses`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
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

export async function getPrerequisiteCourses(id: string, authToken: string) {
    try {
        const res: {
            data: PrerequisiteCourse[];
            message: string;
            total: number;
        } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${id}/pre-requisite-courses`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
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

export async function getCourseCatalogue(
    id: string,
    authToken: string,
    catalogue: string
) {
    try {
        const res: { data: CourseCatalogue[] } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/common/catalouge-details/${id}/${catalogue}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
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

export async function getRequirementCatalogues(id: string, authToken: string) {
    try {
        const res: { data: RequirementCatalogue[] } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/student-catelogue-requirment/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
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
