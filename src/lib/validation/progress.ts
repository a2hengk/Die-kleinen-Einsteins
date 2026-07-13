import { z } from "zod";

export const recordAnswerSchema = z.object({
    correct: z.boolean(),
});
