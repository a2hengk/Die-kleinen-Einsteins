import { z } from "zod";
import type { AppSettings } from "@/components/types/settings";

export const defaultAppSettings: AppSettings = {
    account: {
        username: "Lernfreund",
        email: "lernfreund@example.com",
    },
    ui: {
        theme: "light",
    },
    trainer: {
        audioOnCorrect: true,
        autoFocusInput: true,
    },
    accessibility: {
        largeText: false,
        reducedMotion: false,
        highContrast: false,
    },
};

export const settingsSchema = z.object({
    account: z.object({
        username: z.string().trim().min(1, "username must not be empty"),
        email: z.string().trim().email("email must be valid"),
    }),
    ui: z.object({
        theme: z.enum(["light", "dark"]),
    }),
    trainer: z.object({
        audioOnCorrect: z.boolean(),
        autoFocusInput: z.boolean(),
    }),
    accessibility: z.object({
        largeText: z.boolean(),
        reducedMotion: z.boolean(),
        highContrast: z.boolean(),
    }),
});

export const updateSettingsSchema = z.object({
    account: settingsSchema.shape.account.partial().optional(),
    ui: settingsSchema.shape.ui.partial().optional(),
    trainer: settingsSchema.shape.trainer.partial().optional(),
    accessibility: settingsSchema.shape.accessibility.partial().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "at least one settings field must be provided" }
);

export type SettingsPatch = z.infer<typeof updateSettingsSchema>;

export function mergeSettings(base: AppSettings, patch: SettingsPatch): AppSettings {
    return {
        account: {
            ...base.account,
            ...patch.account,
        },
        ui: {
            ...base.ui,
            ...patch.ui,
        },
        trainer: {
            ...base.trainer,
            ...patch.trainer,
        },
        accessibility: {
            ...base.accessibility,
            ...patch.accessibility,
        },
    };
}
