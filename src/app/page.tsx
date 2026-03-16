"use client";

import styleContainer from "../styles/overview-styles/container.module.css";
import styleButton from "../styles/overview-styles/button.module.css";
import styleBody from "../styles/overview-styles/body.module.css";

// import navbar
import { useEffect, useRef, useState } from "react";
import { mountFloatingNavBar } from "../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../components/navbar-components/modalUtils";
import { createSettingsModal } from "../components/navbar-components/settingsModal";

interface Card {
    id: number;
    front: string;
    back: string;
}

export default function Overview() {
    const [cards, setCards] = useState<Card[]>([]);
    const [clicked, setClicked] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ front: string; back: string }>({
        front: "",
        back: "",
    });

    const addCard = () => {
        if (editingId !== null) {
            // Edit existierende Karte
            setCards((prev) =>
                prev.map((card) =>
                    card.id === editingId
                        ? { ...card, front: formData.front, back: formData.back }
                        : card
                )
            );
        } else {
            // Neue Karte erstellen
            setCards((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    front: formData.front,
                    back: formData.back,
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
                <h2>{editingId ? "Karte bearbeiten" : "Neue Karte hinzufügen"}</h2>
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
                            className={`${styleContainer.card} ${
                                clicked.includes(card.id) ? "clicked" : ""
                            }`}
                            onClick={() => toggleCard(card.id)}
                        >
                            <div className={styleContainer.cardContent}>
                                <div>
                                    <p><strong>Vorderseite:</strong> {card.front}</p>
                                    <p><strong>Rückseite:</strong> {card.back}</p>
                                </div>
                                <button
                                    className={styleButton.editButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCard(card.id);
                                    }}
                                >
                                    Löschen
                                </button>
                            </div>
                        </div>
                        <button
                            className={styleButton.editButton}
                            onClick={() => editCard(card.id)}
                        >
                            Bearbeiten
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}