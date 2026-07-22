import { eq } from "drizzle-orm";
import type { AppSettings } from "@/components/types/settings";
import { db } from "../client";
import { appSettings, type AppSettingsRow } from "../schema";

export function toAppSettings(row: AppSettingsRow): AppSettings {
    return {
        account: {
            username: row.username,
            email: row.email,
        },
        ui: {
            theme: row.theme === "dark" ? "dark" : "light",
        },
        trainer: {
            audioOnCorrect: row.audioOnCorrect,
            autoFocusInput: row.autoFocusInput,
        },
        accessibility: {
            largeText: row.largeText,
            reducedMotion: row.reducedMotion,
            highContrast: row.highContrast,
        },
    };
}

function valuesFromSettings(userId: string, settings: AppSettings) {
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

export async function getSettingsForUser(userId: string) {
    const [settings] = await db
        .select()
        .from(appSettings)
        .where(eq(appSettings.userId, userId))
        .limit(1);

    return settings ? toAppSettings(settings) : null;
}

export async function createSettings(userId: string, settings: AppSettings) {
    const [created] = await db
        .insert(appSettings)
        .values(valuesFromSettings(userId, settings))
        .returning();

    return toAppSettings(created);
}

export async function updateSettings(userId: string, settings: AppSettings) {
    const [updated] = await db
        .update(appSettings)
        .set({
            ...valuesFromSettings(userId, settings),
            updatedAt: new Date(),
        })
        .where(eq(appSettings.userId, userId))
        .returning();

    return updated ? toAppSettings(updated) : null;
}
