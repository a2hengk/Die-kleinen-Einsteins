import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
    createSettings,
    getSettingsForUser,
    updateSettings,
} from "@/db/queries/settings";
import { getUserByUsername, updateUsername } from "@/db/queries/users";
import {
    defaultAppSettings,
    mergeSettings,
    settingsSchema,
    updateSettingsSchema,
} from "@/lib/validation/settings";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function GET() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettingsForUser(userId);
    return NextResponse.json(settings ?? defaultAppSettings);
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await getSettingsForUser(userId);
    if (existing) {
        return NextResponse.json(
            { error: "Settings already exist" },
            { status: 409 }
        );
    }

    const usernameOwner = await getUserByUsername(result.data.account.username);
    if (usernameOwner && usernameOwner.id !== userId) {
        return NextResponse.json(
            { error: "Benutzername ist bereits vergeben." },
            { status: 409 }
        );
    }

    await updateUsername(userId, result.data.account.username);
    const settings = await createSettings(userId, result.data);
    return NextResponse.json(settings, { status: 201 });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = updateSettingsSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const current = (await getSettingsForUser(userId)) ?? defaultAppSettings;
    const nextSettings = mergeSettings(current, result.data);
    const usernameOwner = await getUserByUsername(nextSettings.account.username);
    if (usernameOwner && usernameOwner.id !== userId) {
        return NextResponse.json(
            { error: "Benutzername ist bereits vergeben." },
            { status: 409 }
        );
    }

    await updateUsername(userId, nextSettings.account.username);
    const updated =
        (await updateSettings(userId, nextSettings)) ??
        (await createSettings(userId, nextSettings));

    return NextResponse.json(updated);
}
