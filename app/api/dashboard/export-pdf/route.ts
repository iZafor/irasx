import { verifySession } from "@/lib/dal";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await verifySession();
    return Response.json({ message: "todo!" });
}
