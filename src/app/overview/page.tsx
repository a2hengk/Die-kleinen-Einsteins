"use client";

// ─────────────────────────────────────────────
// CSS-Module für Layout/Container
// ─────────────────────────────────────────────
import styleContainer from "../styles/overview-styles/container.module.css";
import { Button } from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { createCard, deleteCard, fetchCards, updateCard } from "@/lib/api/cards";
import type { Flashcard } from "@/lib/types";

// ─────────────────────────────────────────────
// Navbar-Komponenten und Hilfsfunktionen
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mountFloatingNavBar } from "../../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../../components/navbar-components/modalUtils";
import { createSettingsModal } from "../../components/navbar-components/settingsModal";

type Card = Flashcard;

export default function Overview() {
    const [cards, setCards] = useState<Card[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ front: string; back: string }>({
        front: "",
        back: "",
    });

    // Steuert das Formular-Modal (Erstellen / Bearbeiten)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // Die Karte, die im Detail-Modal angezeigt wird (null = geschlossen)
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const router = useRouter();
    const navMountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchCards().then(setCards).catch(() => setCards([]));
    }, []);

    // ─────────────────────────────────────────────
    // Navbar initialisieren (läuft einmalig beim ersten Rendern)
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (!navMountRef.current) return;

        const infoModalController = createInfoModal({ mount: document.body });
        const settingsModalController = createSettingsModal({ mount: document.body });

        const navController = mountFloatingNavBar({
            mount: navMountRef.current,
            onNavigate: (itemId) => {
                if (itemId === "karteikasten") return;
                if (itemId === "selbstlernen") router.push("/selfstudy");
                if (itemId === "abfragen") router.push("/abfrage");
            },
            onOpenInfo: () => infoModalController.open(),
            onOpenSettings: () => settingsModalController.open(),
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

    // ─────────────────────────────────────────────
    // Karte hinzufügen ODER bestehende Karte speichern
    // ─────────────────────────────────────────────
    const saveCard = async () => {
        const trimmedFront = formData.front.trim();
        const trimmedBack = formData.back.trim();

        if (!trimmedFront || !trimmedBack) return;

        if (editingId !== null) {
            const updated = await updateCard(editingId, {
                front: trimmedFront,
                back: trimmedBack,
            });
            setCards((prev) =>
                prev.map((card) => (card.id === editingId ? updated : card))
            );
        } else {
            const created = await createCard(trimmedFront, trimmedBack);
            setCards((prev) => [...prev, created]);
        }

        closeFormModal();
    };

    // Karte anhand ihrer ID aus der Liste entfernen
    const removeCard = async (id: number) => {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card.id !== id));
        setSelectedCard(null);
    };

    // Karte zum Bearbeiten öffnen (aus dem Detail-Modal heraus)
    const startEditCard = (card: Card) => {
        setFormData({ front: card.front, back: card.back });
        setEditingId(card.id);
        setSelectedCard(null);
        setIsFormModalOpen(true);
    };

    // „+" geklickt → leeres Formular-Modal öffnen
    const openAddModal = () => {
        setFormData({ front: "", back: "" });
        setEditingId(null);
        setIsFormModalOpen(true);
    };

    // Formular-Modal schließen und State zurücksetzen
    const closeFormModal = () => {
        setFormData({ front: "", back: "" });
        setEditingId(null);
        setIsFormModalOpen(false);
    };

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    return (
        <div className={styleContainer.header}>
            <h1 className={styleContainer.title}>Karteikartenübersicht</h1>

            {/* Kartenraster */}
            <div className={styleContainer.cardContainer}>

                {/* Vorhandene Karten */}
                {cards.map((card) => (
                    <div key={card.id} className={styleContainer.cardItem}>
                        <div
                            className={styleContainer.card}
                            onClick={() => setSelectedCard(card)}
                        >
                            <div className={styleContainer.cardContent}>
                                <div>
                                    <span className={styleContainer.fieldLabel}>Vorderseite</span>
                                    <p className={styleContainer.fieldValue}>{card.front}</p>
                                </div>
                                <div>
                                    <span className={styleContainer.fieldLabel}>Rückseite</span>
                                    <p className={styleContainer.fieldValue}>{card.back}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* „+" Kachel zum Hinzufügen */}
                <div className={styleContainer.cardItem}>
                    <div
                        className={styleContainer.addPlaceholder}
                        onClick={openAddModal}
                    >
                        <div className={styleContainer.addIcon}>+</div>
                        <span>Neue Karte</span>
                    </div>
                </div>

            </div>

            {/* ── Formular-Modal (Hinzufügen / Bearbeiten) ── */}
            {isFormModalOpen && (
                <div className={styleContainer.overlay} onClick={closeFormModal}>
                    <div
                        className={styleContainer.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className={styleContainer.modalHeader}>
                            {editingId ? "Karte bearbeiten" : "Neue Karte erstellen"}
                        </h2>
                        <hr className={styleContainer.divider} />

                        <div>
                            <span className={styleContainer.fieldLabel}>Vorderseite</span>
                            <Input
                                value={formData.front}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, front: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <span className={styleContainer.fieldLabel}>Rückseite</span>
                            <Input
                                value={formData.back}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, back: e.target.value }))
                                }
                            />
                        </div>

                        <hr className={styleContainer.divider} />

                        <div className={styleContainer.buttonRow}>
                            <Button
                                content={editingId ? "Speichern" : "Hinzufügen"}
                                onClick={saveCard}
                            />
                            <Button
                                content="Abbrechen"
                                color="secondary"
                                onClick={closeFormModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Detail-Modal (Klick auf bestehende Karte) ── */}
            {selectedCard && (
                <div
                    className={styleContainer.overlay}
                    onClick={() => setSelectedCard(null)}
                >
                    <div
                        className={styleContainer.detailModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className={styleContainer.modalHeader}>Karteikarte</h2>
                        <hr className={styleContainer.divider} />

                        <div>
                            <span className={styleContainer.fieldLabel}>Vorderseite</span>
                            <p className={styleContainer.fieldValue}>{selectedCard.front}</p>
                        </div>

                        <div>
                            <span className={styleContainer.fieldLabel}>Rückseite</span>
                            <p className={styleContainer.fieldValue}>{selectedCard.back}</p>
                        </div>

                        <hr className={styleContainer.divider} />

                        <div className={styleContainer.buttonRow}>
                            <Button
                                content="Bearbeiten"
                                color="primary"
                                onClick={() => startEditCard(selectedCard)}
                            />
                            <Button
                                content="Löschen"
                                color="secondary"
                                onClick={() => removeCard(selectedCard.id)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Einhängepunkt für die floating Navbar */}
            <div ref={navMountRef} />
        </div>
    );
}