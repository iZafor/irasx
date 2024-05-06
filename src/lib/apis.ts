import { AuthData } from "./definition"

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
    return fetch(
        `https://iras.iub.edu.bd:8079//api/v1/registration/student-registered-courses/${id}/all`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        }
    );
}