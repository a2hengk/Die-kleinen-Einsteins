import type { CardProgress } from "@/lib/types";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export function fetchProgress(): Promise<CardProgress[]> {
    return fetch("/api/progress").then((res) => handleResponse<CardProgress[]>(res));
}

export function recordAnswer(cardId: number, correct: boolean): Promise<CardProgress> {
    return fetch(`/api/progress/${cardId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ correct }),
    }).then((res) => handleResponse<CardProgress>(res));
}
