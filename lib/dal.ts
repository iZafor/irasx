import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
    const cookie = cookies().get("session")?.value;
    const { valid, studentId, accessToken } = await decrypt(cookie);
    if (!valid) {
        redirect("/");
    }
    return { studentId, accessToken };
});
