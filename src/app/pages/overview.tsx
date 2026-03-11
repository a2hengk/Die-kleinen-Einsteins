"use client";

import styleContainer from "../styles/overview-styles/container.module.css";
import styleButton from "../styles/overview-styles/button.module.css";
import styleBody from "../styles/overview-styles/body.module.css";
import { useState } from "react";

export default function Overview() {
    const [cards, setCards] = useState<number[]>([Date.now()]);
    const [clicked, setClicked] = useState<number[]>([]);

    const addCard = () => {
        setCards((prev) => [...prev, Date.now()]);
    };

    const removeCard = (id: number) => {
        setCards((prev) => prev.filter((cardId) => cardId !== id));
    };

    const toggleCard = (id: number) => {
        setClicked((prev) =>
            prev.includes(id)
                ? prev.filter((cardId) => cardId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className={styleContainer.header}>
            <h1 className={styleContainer.title}>Karteikartenuebersicht</h1>

            <main className={styleBody.main}>
                <button
                    className={styleButton.createButton}
                    onClick={addCard}
                >+</button>

                <div className={styleContainer.cardContainer}>
                    {cards.map((id) => (
                        <div
                            key={id}
                            className={`${styleContainer.card} ${
                                clicked.includes(id) ? "clicked" : ""
                            }`}
                            onClick={() => toggleCard(id)}
                        >
                            <button
                                className={styleButton.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCard(id);
                                }}
                            >-</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}