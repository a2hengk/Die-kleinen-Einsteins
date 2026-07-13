import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getProgressForUser } from "@/db/queries/progress";

export async function GET() {
    const userId = getCurrentUserId();
    const progress = await getProgressForUser(userId);
    return NextResponse.json(progress);
}
