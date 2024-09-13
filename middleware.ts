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

    const { valid } = await decrypt(cookie);
    if (valid && !isProtectedRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
