import { z } from "zod";

const username = z.string().trim().min(2, "username must have at least 2 characters");
const password = z.string().min(1, "password must not be empty");

export const loginSchema = z.object({
    username,
    password,
});

export const registerSchema = z.object({
    username,
    email: z.string().trim().email("email must be valid"),
    password: password.min(4, "password must have at least 4 characters"),
});

export const updatePasswordSchema = z.object({
    currentPassword: password,
    newPassword: password.min(8, "new password must have at least 8 characters"),
});
