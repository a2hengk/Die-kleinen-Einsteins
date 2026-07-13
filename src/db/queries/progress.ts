import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import { cardProgress } from "../schema";

export function getProgressForUser(userId: string) {
    return db
        .select()
        .from(cardProgress)
        .where(eq(cardProgress.userId, userId));
}

export async function recordAnswer(
    userId: string,
    cardId: number,
    correct: boolean
) {
    const [progress] = await db
        .insert(cardProgress)
        .values({
            userId,
            cardId,
            correctCount: correct ? 1 : 0,
            wrongCount: correct ? 0 : 1,
            lastReviewedAt: new Date(),
        })
        .onConflictDoUpdate({
            target: [cardProgress.userId, cardProgress.cardId],
            set: {
                correctCount: correct
                    ? sql`${cardProgress.correctCount} + 1`
                    : cardProgress.correctCount,
                wrongCount: correct
                    ? cardProgress.wrongCount
                    : sql`${cardProgress.wrongCount} + 1`,
                lastReviewedAt: new Date(),
            },
        })
        .returning();
    return progress;
}
