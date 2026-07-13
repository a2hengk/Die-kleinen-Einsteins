import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { cards } from "../schema";

export function getCardsForUser(userId: string) {
    return db
        .select()
        .from(cards)
        .where(eq(cards.userId, userId))
        .orderBy(cards.createdAt);
}

export async function getCardForUser(userId: string, cardId: number) {
    const [card] = await db
        .select()
        .from(cards)
        .where(and(eq(cards.id, cardId), eq(cards.userId, userId)))
        .limit(1);
    return card;
}

export async function createCard(userId: string, front: string, back: string) {
    const [card] = await db
        .insert(cards)
        .values({ userId, front, back })
        .returning();
    return card;
}

export async function updateCard(
    userId: string,
    cardId: number,
    data: { front?: string; back?: string }
) {
    const [card] = await db
        .update(cards)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(cards.id, cardId), eq(cards.userId, userId)))
        .returning();
    return card;
}

export async function deleteCard(userId: string, cardId: number) {
    const [card] = await db
        .delete(cards)
        .where(and(eq(cards.id, cardId), eq(cards.userId, userId)))
        .returning();
    return card;
}
