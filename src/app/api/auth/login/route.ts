import { NextRequest, NextResponse } from "next/server";
import { getSettingsForUser } from "@/db/queries/settings";
import { getUserByUsername } from "@/db/queries/users";
import { createSession } from "@/lib/auth-session";
import { loginSchema } from "@/lib/validation/auth";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const user = await getUserByUsername(result.data.username);
    if (!user || user.password !== result.data.password) {
        return NextResponse.json(
            { error: "Benutzername oder Passwort ist falsch." },
            { status: 401 }
        );
    }

    const settings = await getSettingsForUser(user.id);
    await createSession(user.id);

    return NextResponse.json({
        id: user.id,
        username: user.username,
        email: settings?.account.email ?? "",
    });
}
