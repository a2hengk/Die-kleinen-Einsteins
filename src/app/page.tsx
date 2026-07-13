"use client";

// ─────────────────────────────────────────────
// CSS-Module für Layout/Container und Buttons
// ─────────────────────────────────────────────
import styleContainer from "./styles/overview-styles/container.module.css";
import { Button } from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { createCard, deleteCard, fetchCards, updateCard } from "@/lib/api/cards";
import type { Flashcard } from "@/lib/types";

// ─────────────────────────────────────────────
// Navbar-Komponenten und Hilfsfunktionen
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mountFloatingNavBar } from "../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../components/navbar-components/modalUtils";
import { createSettingsModal } from "../components/navbar-components/settingsModal";

type Card = Flashcard;

export default function Overview() {
    // Liste aller gespeicherten Karteikarten
    const [cards, setCards] = useState<Card[]>([]);

    // IDs der Karten, die gerade "umgedreht" (angeklickt) sind
    const [clicked, setClicked] = useState<number[]>([]);

    // ID der Karte, die gerade bearbeitet wird (null = keine Bearbeitung aktiv)
    const [editingId, setEditingId] = useState<number | null>(null);

    // Formulardaten für Vorder- und Rückseite (sowohl beim Erstellen als auch beim Bearbeiten)
    const [formData, setFormData] = useState<{ front: string; back: string }>({
        front: "",
        back: "",
    });
    const router = useRouter();

    // Ref für den DOM-Einhängepunkt der Navbar
    const navMountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchCards().then(setCards).catch(() => setCards([]));
    }, []);

    // ─────────────────────────────────────────────
    // Navbar initialisieren (läuft einmalig beim ersten Rendern)
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (!navMountRef.current) {
            return;
        }

        // Info- und Einstellungsmodal erstellen und an <body> hängen
        const infoModalController = createInfoModal({ mount: document.body });
        const settingsModalController = createSettingsModal({ mount: document.body });

        // Floating-Navbar einbinden mit Navigation und Modal-Callbacks
        const navController = mountFloatingNavBar({
            mount: navMountRef.current,
            onNavigate: (itemId) => {
                if (itemId === "karteikasten") router.push("/overview");
                if (itemId === "selbstlernen") router.push("/selfstudy");
                if (itemId === "abfragen") router.push("/abfrage");
            },
            onOpenInfo: () => infoModalController.open(),
            onOpenSettings: () => settingsModalController.open(),
        });

        // Dialog-Trigger für Info- und Einstellungsbutton konfigurieren
        const infoButton = navController.getInfoButton();
        const settingsButton = navController.getSettingsButton();
        configureDialogTrigger(infoButton, "vocab-info-dialog");
        configureDialogTrigger(settingsButton, "vocab-settings-dialog");

        // Aufräumen beim Unmount der Komponente (verhindert Memory Leaks)
        return () => {
            navController.destroy();
            infoModalController.destroy();
            settingsModalController.destroy();
        };
    }, []);

    // ─────────────────────────────────────────────
    // Karte hinzufügen ODER bestehende Karte speichern
    // ─────────────────────────────────────────────
    const addCard = async () => {
        const trimmedFront = formData.front.trim();
        const trimmedBack = formData.back.trim();

        if (!trimmedFront || !trimmedBack) {
            return;
        }

        if (editingId !== null) {
            // Bearbeitungsmodus: Karte mit passender ID aktualisieren
            const updated = await updateCard(editingId, {
                front: trimmedFront,
                back: trimmedBack,
            });
            setCards((prev) =>
                prev.map((card) => (card.id === editingId ? updated : card))
            );
        } else {
            // Neue Karte anlegen
            const created = await createCard(trimmedFront, trimmedBack);
            setCards((prev) => [...prev, created]);
        }

        // Formular zurücksetzen und Bearbeitungsmodus beenden
        setFormData({ front: "", back: "" });
        setEditingId(null);
    };

    // Karte anhand ihrer ID aus der Liste entfernen
    const removeCard = async (id: number) => {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    // Karte ein-/ausklappen (Toggle): ID wird zur clicked-Liste hinzugefügt oder entfernt
    const toggleCard = (id: number) => {
        setClicked((prev) =>
            prev.includes(id)
                ? prev.filter((cardId) => cardId !== id)
                : [...prev, id]
        );
    };

    // Karte zum Bearbeiten vorbereiten: Formulardaten befüllen und Bearbeitungsmodus aktivieren
    const editCard = (id: number) => {
        const card = cards.find((c) => c.id === id);
        if (card) {
            setFormData({ front: card.front, back: card.back });
            setEditingId(id);
        }
    };

    // Bearbeitung abbrechen: Formular leeren und Bearbeitungsmodus beenden
    const cancelEdit = () => {
        setFormData({ front: "", back: "" });
        setEditingId(null);
    };

    // ─────────────────────────────────────────────
    // Render: Übersichtsseite mit Formular und Kartenliste
    // ─────────────────────────────────────────────
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

            {/* Liste aller Karteikarten */}
            <div className={styleContainer.cardContainer}>
                {cards.map((card) => (
                    <div key={card.id} className={styleContainer.cardItem}>

                        {/* Karte: Klick dreht sie um (Toggle) */}
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
                                {/* Löschen-Button entfernt die Karte aus dem State */}
                                <Button
                                    content="Löschen"
                                    color="secondary"
                                    onClick={() => removeCard(card.id)}
                                />

                                {/* Bearbeiten-Button füllt das Formular mit den Kartendaten */}
                                <Button
                                    content="Bearbeiten"
                                    color="primary"
                                    onClick={() => editCard(card.id)}
                                />
                            </div>
                        </div>


                    </div>
                ))}
            </div>

            {/* Einhängepunkt für die floating Navbar */}
            <div ref={navMountRef} />
        </div>
    );
}