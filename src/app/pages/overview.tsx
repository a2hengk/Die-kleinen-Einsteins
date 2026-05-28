"use client";

import styleContainer from "../styles/overview-styles/container.module.css";
import styleButton from "../styles/overview-styles/button.module.css";
import { loadFlashcards, saveFlashcards, type Flashcard } from "../../lib/flashcards";
import { useState } from "react";
import { useEffect } from "react";

export default function Overview() {
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [clicked, setClicked] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ front: string; back: string }>({
        front: "",
        back: "",
    });
    const [isHydrated, setIsHydrated] = useState(false);
    const isFormValid = formData.front.trim().length > 0 && formData.back.trim().length > 0;

    useEffect(() => {
        setCards(loadFlashcards());
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        saveFlashcards(cards);
    }, [cards, isHydrated]);

    const addCard = () => {
        const trimmedFront = formData.front.trim();
        const trimmedBack = formData.back.trim();

        if (!trimmedFront || !trimmedBack) {
            return;
        }

        if (editingId !== null) {
            // Edit existierende Karte
            setCards((prev) =>
                prev.map((card) =>
                    card.id === editingId
                        ? { ...card, front: trimmedFront, back: trimmedBack }
                        : card
                )
            );
        } else {
            // Neue Karte erstellen
            setCards((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    front: trimmedFront,
                    back: trimmedBack,
                },
            ]);
        }
        setFormData({ front: "", back: "" });
        setEditingId(null);
    };

    const removeCard = (id: number) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    const toggleCard = (id: number) => {
        setClicked((prev) =>
            prev.includes(id)
                ? prev.filter((cardId) => cardId !== id)
                : [...prev, id]
        );
    };

    const editCard = (id: number) => {
        const card = cards.find((c) => c.id === id);
        if (card) {
            setFormData({ front: card.front, back: card.back });
            setEditingId(id);
        }
    };

    const cancelEdit = () => {
        setFormData({ front: "", back: "" });
        setEditingId(null);
    };

    return (
        <div className={styleContainer.header}>
            <h1 className={styleContainer.title}>Karteikartenuebersicht</h1>
            {/* Formular zum Hinzufügen/Bearbeiten */}
            <div className={styleContainer.formContainer}>
                <h2 className={styleContainer.sectionTitle}>
                    {editingId ? "Karte bearbeiten" : "Neue Karte hinzufügen"}
                </h2>
                <input
                    type="text"
                    placeholder="Vorderseite"
                    value={formData.front}
                    onChange={(e) => setFormData((prev) => ({ ...prev, front: e.target.value }))}
                    className={styleButton.input}
                />
                <input
                    type="text"
                    placeholder="Rückseite"
                    value={formData.back}
                    onChange={(e) => setFormData((prev) => ({ ...prev, back: e.target.value }))}
                    className={styleButton.input}
                />
                <div className={styleButton.buttonGroup}>
                    <button
                        onClick={addCard}
                        className={styleButton.submitButton}
                        disabled={!isFormValid}
                    >
                        {editingId ? "Speichern" : "Hinzufügen"}
                    </button>
                    {editingId && (
                        <button
                            onClick={cancelEdit}
                            className={styleButton.cancelButton}
                        >
                            Abbrechen
                        </button>
                    )}
                </div>
            </div>

            {/* Kartenliste */}
            <div className={styleContainer.cardContainer}>
                {cards.map((card) => (
                    <div key={card.id} className={styleContainer.cardItem}>
                        <div
                            className={`${styleContainer.card} ${clicked.includes(card.id) ? styleContainer.clicked : ""
                                }`}
                            onClick={() => toggleCard(card.id)}
                        >
                            <div className={styleContainer.cardContent}>
                                <div>
                                    <p><strong>Vorderseite:</strong> {card.front}</p>
                                    <p><strong>Rückseite:</strong> {card.back}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styleButton.cardActionRow}>
                            <button
                                className={styleButton.editButton}
                                onClick={() => editCard(card.id)}
                            >
                                Bearbeiten
                            </button>
                            <button
                                className={styleButton.deleteButton}
                                onClick={() => removeCard(card.id)}
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}