import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getCardForUser } from "@/db/queries/cards";
import { recordAnswer } from "@/db/queries/progress";
import { recordAnswerSchema } from "@/lib/validation/progress";
import { validationErrorResponse } from "@/lib/validation/respond";

type RouteParams = { params: Promise<{ cardId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
    const { cardId: cardIdParam } = await params;
    const cardId = Number(cardIdParam);
    if (!Number.isInteger(cardId)) {
        return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const result = recordAnswerSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await getCardForUser(userId, cardId);
    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const progress = await recordAnswer(userId, cardId, result.data.correct);
    return NextResponse.json(progress);
}
