import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
    createSettings,
    getSettingsForUser,
    updateSettings,
} from "@/db/queries/settings";
import {
    defaultAppSettings,
    mergeSettings,
    settingsSchema,
    updateSettingsSchema,
} from "@/lib/validation/settings";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function GET() {
    const userId = getCurrentUserId();
    const settings = await getSettingsForUser(userId);
    return NextResponse.json(settings ?? defaultAppSettings);
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = getCurrentUserId();
    const existing = await getSettingsForUser(userId);
    if (existing) {
        return NextResponse.json(
            { error: "Settings already exist" },
            { status: 409 }
        );
    }

    const settings = await createSettings(userId, result.data);
    return NextResponse.json(settings, { status: 201 });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = updateSettingsSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = getCurrentUserId();
    const current = (await getSettingsForUser(userId)) ?? defaultAppSettings;
    const nextSettings = mergeSettings(current, result.data);
    const updated =
        (await updateSettings(userId, nextSettings)) ??
        (await createSettings(userId, nextSettings));

    return NextResponse.json(updated);
}
