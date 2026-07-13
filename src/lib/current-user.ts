/**
 * Single source of truth for "who is the current user" until real
 * authentication exists. Every query/route MUST go through this function
 * instead of hard-coding a user id.
 *
 * TODO once login exists: replace the body with a real session/auth lookup
 * (e.g. reading the session from cookies/headers). No caller needs to change.
 */
export function getCurrentUserId(): string {
    return process.env.DEV_USER_ID ?? "dev-user";
}
