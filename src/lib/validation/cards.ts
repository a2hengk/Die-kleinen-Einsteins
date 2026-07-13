import { z } from "zod";

export const createCardSchema = z.object({
    front: z.string().trim().min(1, "front must not be empty"),
    back: z.string().trim().min(1, "back must not be empty"),
});

export const updateCardSchema = z
    .object({
        front: z.string().trim().min(1, "front must not be empty").optional(),
        back: z.string().trim().min(1, "back must not be empty").optional(),
    })
    .refine((data) => data.front !== undefined || data.back !== undefined, {
        message: "at least one of front or back must be provided",
    });
