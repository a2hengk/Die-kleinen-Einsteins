import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { createCard, getCardsForUser } from "@/db/queries/cards";
import { createCardSchema } from "@/lib/validation/cards";
import { validationErrorResponse } from "@/lib/validation/respond";

export async function GET() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await getCardsForUser(userId);
    return NextResponse.json(cards);
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = createCardSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await createCard(userId, result.data.front, result.data.back);
    return NextResponse.json(card, { status: 201 });
}
