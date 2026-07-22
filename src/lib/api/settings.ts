import type { AppSettings } from "@/components/types/settings";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export function fetchSettings(): Promise<AppSettings> {
    return fetch("/api/settings").then((res) => handleResponse<AppSettings>(res));
}

export function createSettings(settings: AppSettings): Promise<AppSettings> {
    return fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
    }).then((res) => handleResponse<AppSettings>(res));
}

export function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return fetch("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
    }).then((res) => handleResponse<AppSettings>(res));
}
