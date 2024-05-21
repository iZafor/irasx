"use server";

import { LoginFormState, LoginFormSchema, AuthResponse } from "./definition";

export async function authenticateUser(state: LoginFormState, formData: FormData) {
    const authData = await LoginFormSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password")
    });
    if (!authData.success) {
        return {
            errors: authData.error.flatten().fieldErrors
        };
    }

    try {
        const res: AuthResponse = await fetch(
            "https://iras.iub.edu.bd:8079//v3/account/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Referer": "http://www.irasv1.iub.edu.bd/"
                },
                body: JSON.stringify(authData.data)
            }
        ).then(res => res.json());

        if (res.message === "EPF") {
            return { message: "Invalid Credentials" };
        }

        if (res.message !== "Success") {
            return { message: res.message };
        }

        return {
            authResponse: {
                studentId: authData.data.email,
                authToken: res.data?.[0]?.["access_token"],
                expiry: res.data?.[0]?.["expires"]
            }
        };
    } catch (error) {
        console.error(error);
    }
}