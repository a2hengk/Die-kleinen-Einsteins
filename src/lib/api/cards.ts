import type { Flashcard } from "@/lib/types";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export function fetchCards(): Promise<Flashcard[]> {
    return fetch("/api/cards").then((res) => handleResponse<Flashcard[]>(res));
}

export function createCard(front: string, back: string): Promise<Flashcard> {
    return fetch("/api/cards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ front, back }),
    }).then((res) => handleResponse<Flashcard>(res));
}

export function updateCard(
    id: number,
    data: { front?: string; back?: string }
): Promise<Flashcard> {
    return fetch(`/api/cards/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => handleResponse<Flashcard>(res));
}

export function deleteCard(id: number): Promise<Flashcard> {
    return fetch(`/api/cards/${id}`, { method: "DELETE" }).then((res) =>
        handleResponse<Flashcard>(res)
    );
}
