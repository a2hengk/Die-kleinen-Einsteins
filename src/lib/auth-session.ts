import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "vocab-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
    const secret = process.env.AUTH_SECRET;
    if (secret) return secret;
    if (process.env.NODE_ENV !== "production") return "development-auth-secret";
    throw new Error("AUTH_SECRET is not set");
}

function sign(userId: string): string {
    return createHmac("sha256", getSessionSecret())
        .update(userId)
        .digest("hex");
}

function createSessionToken(userId: string): string {
    return `${userId}.${sign(userId)}`;
}

function readSessionToken(token: string): string | null {
    const separator = token.lastIndexOf(".");
    if (separator < 1) return null;

    const userId = token.slice(0, separator);
    const signature = token.slice(separator + 1);
    const expected = sign(userId);
    if (signature.length !== expected.length) return null;

    const valid = timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );
    return valid ? userId : null;
}

export async function getSessionUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return token ? readSessionToken(token) : null;
}

export async function createSession(userId: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(userId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
