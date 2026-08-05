import { getSessionUserId } from "./auth-session";

export function getCurrentUserId(): Promise<string | null> {
    return getSessionUserId();
}
