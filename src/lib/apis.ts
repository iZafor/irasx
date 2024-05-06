import { AuthData } from "./definition";

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
