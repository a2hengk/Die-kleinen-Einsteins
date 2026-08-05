import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth-session";

export async function POST() {
    await deleteSession();
    return new NextResponse(null, { status: 204 });
}
