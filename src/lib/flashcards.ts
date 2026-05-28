export type Flashcard = {
    id: number;
    front: string;
    back: string;
};

const STORAGE_KEY = "die-kleinen-einsteins:flashcards";

export const loadFlashcards = (): Flashcard[] => {
    if (typeof window === "undefined") {
        return [];
    }

    const storedCards = window.localStorage.getItem(STORAGE_KEY);
    if (!storedCards) {
        return [];
    }

    try {
        const parsed = JSON.parse(storedCards) as unknown;
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (item): item is Flashcard =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as Flashcard).id === "number" &&
                typeof (item as Flashcard).front === "string" &&
                typeof (item as Flashcard).back === "string"
        );
    } catch {
        return [];
    }
};

export const saveFlashcards = (cards: Flashcard[]): void => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};