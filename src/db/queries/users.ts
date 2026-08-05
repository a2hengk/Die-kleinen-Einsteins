import { eq } from "drizzle-orm";
import type { AppSettings } from "@/components/types/settings";
import { db } from "../client";
import { appSettings, users } from "../schema";

function settingsValues(userId: string, settings: AppSettings) {
    return {
        userId,
        username: settings.account.username,
        email: settings.account.email,
        theme: settings.ui.theme,
        audioOnCorrect: settings.trainer.audioOnCorrect,
        autoFocusInput: settings.trainer.autoFocusInput,
        largeText: settings.accessibility.largeText,
        reducedMotion: settings.accessibility.reducedMotion,
        highContrast: settings.accessibility.highContrast,
    };
}

export async function getUserById(userId: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
    return user;
}

export async function getUserByUsername(username: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
    return user;
}

export async function createUser(
    userId: string,
    username: string,
    password: string,
    settings: AppSettings
) {
    return db.transaction(async (tx) => {
        const [user] = await tx
            .insert(users)
            .values({ id: userId, username, password })
            .returning();

        await tx
            .insert(appSettings)
            .values(settingsValues(userId, settings));

        return user;
    });
}

export async function updateUsername(userId: string, username: string) {
    const [user] = await db
        .update(users)
        .set({ username, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
    return user;
}

export async function updatePassword(userId: string, password: string) {
    const [user] = await db
        .update(users)
        .set({ password, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
    return user;
}
