"use server";

import { cookies } from "next/headers";
import { LoginFormState, LoginFormSchema, AuthResponse } from "./definition";
import { encrypt } from "./session";
import { redirect } from "next/navigation";

export async function loginUser(state: LoginFormState, formData: FormData) {
    const authData = await LoginFormSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!authData.success) {
        return {
            errors: authData.error.flatten().fieldErrors,
        };
    }

    try {
        const res: AuthResponse = await fetch(
            "https://iras.iub.edu.bd:8079//v3/account/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
                body: JSON.stringify(authData.data),
            }
        ).then((res) => res.json());

        if (res.message === "EPF") {
            return { message: "Invalid Credentials" };
        }

        if (res.message !== "Success") {
            return { message: res.message };
        }

        const expiresAt = new Date(res.data?.[0]?.["expires"]!);
        const session = await encrypt({
            studentId: authData.data.email,
            accessToken: res.data?.[0]?.["access_token"]!,
        }, expiresAt);

        cookies().set("session", session, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: "lax",
            path: "/",
        });
    } catch (error) {
        console.error(error);
    }
    
    redirect("/dashboard");
}

export async function logoutUser() {
    cookies().delete("session");
    redirect("/");
}
