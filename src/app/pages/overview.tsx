"use client";

import styleContainer from "../styles/overview-styles/container.module.css";
import { Button } from "../../components/ui/button/button";
import Input from "../../components/ui/input/input";

// import navbar
import { useEffect, useRef, useState } from "react";
import { mountFloatingNavBar } from "../../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../../components/navbar-components/modalUtils";
import { createSettingsModal } from "../../components/navbar-components/settingsModal";

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
    const navMountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!navMountRef.current) {
            return;
        }

        const infoModalController = createInfoModal({
            mount: document.body,
        });
        const settingsModalController = createSettingsModal({
            mount: document.body,
        });
        const navController = mountFloatingNavBar({
            mount: navMountRef.current,
            onNavigate: (itemId) => {
                if (itemId === "karteikasten") {
                    return;
                }

                if (itemId === "selbstlernen") {
                    window.location.href = "/selfstudy";
                }

                if (itemId === "abfragen") {
                    window.location.href = "/abfrage";
                }
            },
            onOpenInfo: () => {
                infoModalController.open();
            },
            onOpenSettings: () => {
                settingsModalController.open();
            },
        });

        const infoButton = navController.getInfoButton();
        const settingsButton = navController.getSettingsButton();

        configureDialogTrigger(infoButton, "vocab-info-dialog");
        configureDialogTrigger(settingsButton, "vocab-settings-dialog");

        return () => {
            navController.destroy();
            infoModalController.destroy();
            settingsModalController.destroy();
        };
    }, []);

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
                <Input
                    value={formData.front}
                    onChange={(e) => setFormData((prev) => ({ ...prev, front: e.target.value }))}
                />
                <Input
                    value={formData.back}
                    onChange={(e) => setFormData((prev) => ({ ...prev, back: e.target.value }))}
                />
                <Button content={editingId ? "Speichern" : "Hinzufügen"} onClick={addCard} />
                {editingId && (
                    <Button content="Abbrechen" onClick={cancelEdit} color="secondary" />
                )}
            </div>

            {clicked.length > 0 && (
                <div 
                    className={styleContainer.backdrop} 
                    onClick={() => setClicked([])}
                />
            )}

            {/* Kartenliste */}
            <div className={styleContainer.cardContainer}>
                {cards.map((card) => (
                    <div key={card.id} className={styleContainer.cardItem}>
                        <div
                            className={`${styleContainer.card} ${clicked.includes(card.id) ? "clicked" : ""
                                }`}
                            onClick={() => toggleCard(card.id)}
                        >
                            <div className={styleContainer.cardContent}>
                                <div>
                                    <p><strong>Vorderseite:</strong> {card.front}</p>
                                    <p><strong>Rückseite:</strong> {card.back}</p>
                                </div>
                                <Button content="Löschen" onClick={() => removeCard(card.id)} />
                            </div>
                        </div>
                        <Button content="Bearbeiten" onClick={() => editCard(card.id)} />
                    </div>
                ))}
            </div>
            <div ref={navMountRef} />
        </div>
    );
}
