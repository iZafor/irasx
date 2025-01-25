"use server";

import { cookies } from "next/headers";
import { LoginFormState, LoginFormSchema, AuthResponse } from "./definition";
import { encrypt } from "./session";
import { redirect } from "next/navigation";
import CryptoJs from "crypto-js";

const PASS_EN_KEY = CryptoJs.enc.Utf8.parse(process.env.PASS_ENCRYPTION_KEY!);
const PASS_EN_IV = CryptoJs.enc.Utf8.parse(process.env.PASS_ENCRYPTION_IV!);

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

    const { email, password } = authData.data; 

    try {
        const encryptedPass = CryptoJs.AES.encrypt(
            CryptoJs.enc.Utf8.parse(password),
            PASS_EN_KEY,
            {
                keySize: 16,
                iv: PASS_EN_IV,
                padding: CryptoJs.pad.Pkcs7
            }
        ).toString();

        const res: AuthResponse = await fetch(
            "https://iras.iub.edu.bd:8079//v3/account/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Referer: "http://www.irasv1.iub.edu.bd/",
                },
                body: JSON.stringify({
                    email,
                    password: encryptedPass
                }),
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
