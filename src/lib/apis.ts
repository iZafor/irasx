import {
    AuthData,
    GradesResponse,
    OfferedCourse,
    PreRequisiteCourse,
    CourseCatalogue,
    RequirementCatalogue
} from "./definition";

export async function login(data: AuthData) {
    return fetch(
        "https://iras.iub.edu.bd:8079//v2/account/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
}

export async function getGrades(id: string, authToken: string) {
    try {
        const res: GradesResponse = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/student-registered-courses/${id}/all`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        ).then(res => res.json());
        return res;
    } catch (error) {
        console.error(error);
    }
    return { data: [], total: 0 };
}

export async function getOfferedCourses(id: string, authToken: string) {
    try {
        const res: { data: { eligibleOfferCourses: OfferedCourse[] }; success: boolean } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${id}/all-offer-courses`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        ).then(res => res.json());
        return res.data.eligibleOfferCourses;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getPreRequisiteCourses(id: string, authToken: string) {
    try {
        const res: { data: PreRequisiteCourse[]; message: string; total: number } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/registration/${id}/pre-requisite-courses`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        ).then(res => res.json());
        return res.data;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getCourseCatalogue(id: string, authToken: string, catalogue: string) {
    try {
        const res: { data: CourseCatalogue[] } = await fetch(
            `https://iras.iub.edu.bd:8079//api/v1/common/catalouge-details/${id}/${catalogue}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        ).then(res => res.json());
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
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        ).then(res => res.json());
        return res.data;
    } catch (error) {
        console.error(error);
    }
    return [];
}