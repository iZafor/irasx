import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./definition";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload, expiresAt: Date) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload: { studentId, accessToken } } = await jwtVerify<SessionPayload>(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return { studentId, accessToken, valid: true };
    } catch (error) {
        console.error(error);
        return { valid: false };
    }
}
