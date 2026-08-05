import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSettingsByEmail } from "@/db/queries/settings";
import { createUser, getUserByUsername } from "@/db/queries/users";
import { createSession } from "@/lib/auth-session";
import { defaultAppSettings } from "@/lib/validation/settings";
import { registerSchema } from "@/lib/validation/auth";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = registerSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const existing = await getUserByUsername(result.data.username);
    if (existing) {
        return NextResponse.json(
            { error: "Benutzername ist bereits vergeben." },
            { status: 409 }
        );
    }

    const existingSettings = await getSettingsByEmail(result.data.email);
    if (existingSettings) {
        return NextResponse.json(
            { error: "Diese E-Mail-Adresse ist bereits registriert." },
            { status: 409 }
        );
    }

    const userId = randomUUID();
    const settings = {
        ...defaultAppSettings,
        account: {
            username: result.data.username,
            email: result.data.email,
        },
    };

    const user = await createUser(
        userId,
        result.data.username,
        result.data.password,
        settings
    );
    await createSession(user.id);

    return NextResponse.json(
        { id: user.id, username: user.username, email: result.data.email },
        { status: 201 }
    );
}
