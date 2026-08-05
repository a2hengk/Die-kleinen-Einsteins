import { NextResponse } from "next/server";
import { getSettingsForUser } from "@/db/queries/settings";
import { getUserById } from "@/db/queries/users";
import { getCurrentUserId } from "@/lib/current-user";

export async function GET() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettingsForUser(user.id);
    return NextResponse.json({
        id: user.id,
        username: user.username,
        email: settings?.account.email ?? "",
    });
}
