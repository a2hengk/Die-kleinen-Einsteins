import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { deleteCard, updateCard } from "@/db/queries/cards";
import { updateCardSchema } from "@/lib/validation/cards";
import { validationErrorResponse } from "@/lib/validation/respond";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const cardId = Number(id);
    if (!Number.isInteger(cardId)) {
        return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const result = updateCardSchema.safeParse(body);
    if (!result.success) {
        return validationErrorResponse(result.error);
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await updateCard(userId, cardId, result.data);
    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const cardId = Number(id);
    if (!Number.isInteger(cardId)) {
        return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await deleteCard(userId, cardId);
    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
}
