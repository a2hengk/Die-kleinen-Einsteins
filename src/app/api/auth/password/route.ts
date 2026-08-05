import { NextRequest, NextResponse } from "next/server";
import { getUserById, updatePassword } from "@/db/queries/users";
import { getCurrentUserId } from "@/lib/current-user";
import { updatePasswordSchema } from "@/lib/validation/auth";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function PATCH(request: NextRequest) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const result = updatePasswordSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const user = await getUserById(userId);
    if (!user || user.password !== result.data.currentPassword) {
        return NextResponse.json(
            { error: "Das aktuelle Passwort ist falsch." },
            { status: 400 }
        );
    }

    await updatePassword(userId, result.data.newPassword);
    return new NextResponse(null, { status: 204 });
}
