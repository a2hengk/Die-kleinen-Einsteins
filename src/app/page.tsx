"use client";

// ─────────────────────────────────────────────
// CSS-Module für Layout/Container und Buttons
// ─────────────────────────────────────────────
import styleContainer from "./styles/overview-styles/container.module.css";
import styleButton from "./styles/overview-styles/button.module.css";
import { Button } from "@/components/ui/button/button";

// ─────────────────────────────────────────────
// Navbar-Komponenten und Hilfsfunktionen
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { mountFloatingNavBar } from "../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../components/navbar-components/modalUtils";
import { createSettingsModal } from "../components/navbar-components/settingsModal";

// ─────────────────────────────────────────────
// TypeScript-Interface: Struktur einer Karteikarte
// Jede Karte hat eine eindeutige ID, Vorder- und Rückseite
// ─────────────────────────────────────────────
interface Card {
    id: number;
    front: string;
    back: string;
}

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

    // Ref für den DOM-Einhängepunkt der Navbar
    const navMountRef = useRef<HTMLDivElement | null>(null);

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
                if (itemId === "karteikasten") return; // Aktuelle Seite – kein Wechsel nötig

                if (itemId === "selbstlernen") {
                    window.location.href = "/selfstudy"; // Weiterleitung zum Selbstlern-Modus
                }

                if (itemId === "abfragen") {
                    window.location.href = "/abfrage"; // Weiterleitung zum Abfrage-Modus
                }
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
    const addCard = () => {
        if (editingId !== null) {
            // Bearbeitungsmodus: Karte mit passender ID aktualisieren
            setCards((prev) =>
                prev.map((card) =>
                    card.id === editingId
                        ? { ...card, front: formData.front, back: formData.back }
                        : card
                )
            );
        } else {
            // Neue Karte mit aktuellem Timestamp als eindeutiger ID anlegen
            setCards((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    front: formData.front,
                    back: formData.back,
                },
            ]);
        }

        // Formular zurücksetzen und Bearbeitungsmodus beenden
        setFormData({ front: "", back: "" });
        setEditingId(null);
    };

    // Karte anhand ihrer ID aus der Liste entfernen
    const removeCard = (id: number) => {
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

            {/* Formular zum Erstellen oder Bearbeiten einer Karte */}
            <div className={styleContainer.formContainer}>
                <h2>{editingId ? "Karte bearbeiten" : "Neue Karte hinzufügen"}</h2>

                {/* Eingabefeld für die Vorderseite */}
                <input
                    type="text"
                    placeholder="Vorderseite"
                    value={formData.front}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, front: e.target.value }))
                    }
                    className={styleButton.input}
                />

                {/* Eingabefeld für die Rückseite */}
                <input
                    type="text"
                    placeholder="Rückseite"
                    value={formData.back}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, back: e.target.value }))
                    }
                    className={styleButton.input}
                />

                {/* Buttons: Speichern/Hinzufügen + optional Abbrechen im Bearbeitungsmodus */}
                <div className={styleButton.buttonGroup}>
                    <Button
                        content={editingId ? "Speichern" : "Hinzufügen"}
                        color="primary"
                        onClick={addCard}
                    />
                    {editingId && (
                        <Button
                            content="Abbrechen"
                            color="secondary"
                            onClick={cancelEdit}
                        />
                    )}
                </div>
            </div>

            {/* Liste aller Karteikarten */}
            <div className={styleContainer.cardContainer}>
                {cards.map((card) => (
                    <div key={card.id} className={styleContainer.cardItem}>

                        {/* Karte: Klick dreht sie um (Toggle) */}
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
                                {/* Löschen-Button entfernt die Karte aus dem State */}
                                <Button
                                    content="Löschen"
                                    color="secondary"
                                    onClick={() => removeCard(card.id)}
                                />
                            </div>
                        </div>

                        {/* Bearbeiten-Button füllt das Formular mit den Kartendaten */}
                        <Button
                            content="Bearbeiten"
                            color="primary"
                            onClick={() => editCard(card.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Einhängepunkt für die floating Navbar */}
            <div ref={navMountRef} />
        </div>
    );
}