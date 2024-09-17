import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);

    const cookie = cookies().get("session")?.value;
    if (!cookie && !isProtectedRoute) {
        return NextResponse.next();
    }
    if (!cookie && isProtectedRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    const { valid } = await decrypt(cookie);
    if (valid) {
        if (!isProtectedRoute) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else {
            return NextResponse.next();
        }
    } else {
        cookies().delete("session"); // delete invalid cookie to prevent further redirection
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
