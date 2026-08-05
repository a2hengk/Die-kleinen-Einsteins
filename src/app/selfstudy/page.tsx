"use client";

import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import StatusBar from '../../components/ui/statusbar/statusbar';
import { Button } from '../../components/ui/button/button';
import { fetchCards } from '@/lib/api/cards';
import { fetchCurrentUser } from '@/lib/api/auth';
import { recordAnswer } from '@/lib/api/progress';
import type { Flashcard } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Result } from '@/components/abfrage/result';

// import navbar
import { useEffect, useRef, useState } from "react";
import { mountFloatingNavBar } from "../../components/navbar-components/floatingNavBar";
import { createInfoModal } from "../../components/navbar-components/infoModal";
import { configureDialogTrigger } from "../../components/navbar-components/modalUtils";
import { createSettingsModal } from "../../components/navbar-components/settingsModal";

export default function SelfStudy() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const navMountRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const totalQuestions = cards.length;
    const hasCards = totalQuestions > 0;
    const currentQuestion = hasCards ? currentIndex + 1 : 0;
    const currentCard = hasCards ? cards[currentIndex] : null;

    useEffect(() => {
        fetchCurrentUser()
            .then((user) => {
                if (!user) {
                    router.replace("/anmeldung");
                    return;
                }

                fetchCards().then(setCards).catch(() => setCards([]));
            })
            .catch(() => router.replace("/anmeldung"));
    }, [router]);

    useEffect(() => {
        if (currentIndex < cards.length) {
            return;
        }

        setCurrentIndex(Math.max(0, cards.length - 1));
    }, [cards.length, currentIndex]);


    
    // Navbar initialisieren
    // Wurde Händisch in overview/page.tsx programmiert und dann von der KI zu selfstudy/page.tsx und abfrage/page.tsx übernommen.
    

    useEffect(() => {
        if (!navMountRef.current) {
            return;
        }

        const infoModalController = createInfoModal({
            mount: document.body
        });
        const settingsModalController = createSettingsModal({
            mount: document.body
        });
        const navController = mountFloatingNavBar({
            mount: navMountRef.current,
            onNavigate: (itemId) => {
                if (itemId === "karteikasten") router.push("/overview");
                if (itemId === "selbstlernen") return;
                if (itemId === "abfragen") router.push("/abfrage");
            },
            onOpenInfo: () => {
                infoModalController.open();
            },
            onOpenSettings: () => {
                settingsModalController.open();
            }
        });

        const infoButton = navController.getInfoButton();
        const settingsButton = navController.getSettingsButton();
        const selbstlernenButton = navMountRef.current.querySelector<HTMLButtonElement>(
            '[data-nav-id="selbstlernen"]'
        );
        const karteikastenButton = navMountRef.current.querySelector<HTMLButtonElement>(
            '[data-nav-id="karteikasten"]'
        );

        configureDialogTrigger(infoButton, "vocab-info-dialog");
        configureDialogTrigger(settingsButton, "vocab-settings-dialog");
        karteikastenButton?.classList.remove("is-active");
        karteikastenButton?.setAttribute("aria-current", "false");
        selbstlernenButton?.classList.add("is-active");
        selbstlernenButton?.setAttribute("aria-current", "page");

        return () => {
            navController.destroy();
            infoModalController.destroy();
            settingsModalController.destroy();
        };
    }, [router]);

    const handleAnswer = (isCorrect: boolean) => {
        if (!hasCards || isComplete || !currentCard) {
            return;
        }

        recordAnswer(currentCard.id, isCorrect).catch(() => {});

        if (isCorrect) {
            setCorrectCount((prev) => prev + 1);
        } else {
            setWrongCount((prev) => prev + 1);
        }

        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev) => prev + 1);
            setIsFlipped(false);
            return;
        }

        setIsComplete(true);
    };

    const restartSession = () => {
        setCorrectCount(0);
        setWrongCount(0);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsComplete(false);
    };

    // end Navbar setup

    return (
        <div className={stylesContainer.primary}>
            <StatusBar
                correctCount={correctCount}
                wrongCount={wrongCount}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
            />

            {isComplete ? (
                <div className={stylesContainer.resultWrapper}>
                    <Result data={{ score: correctCount, fail: wrongCount }} />
                </div>
            ) : (
                <>
                    <div
                        className={`${stylesContainer.card} ${isFlipped ? stylesContainer.flipover : ''} ${!hasCards ? stylesContainer.cardEmpty : ''}`}
                        onClick={() => {
                            if (hasCards) {
                                setIsFlipped((prev) => !prev);
                            }
                        }}
                    >
                        {!hasCards && 'Noch keine Karten vorhanden. Erstelle zuerst Karten im Karteikasten.'}
                        {hasCards && (
                            <>
                                <div className={stylesContainer.cardSideLabel}>
                                    {isFlipped ? 'Rückseite' : 'Vorderseite'}
                                </div>
                                <div className={stylesContainer.cardText}>
                                    {isFlipped ? currentCard?.back : currentCard?.front}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={stylesContainer.buttons}>
                        <Button
                            content="Richtig"
                            color="primary"
                            onClick={() => handleAnswer(true)}
                            disabled={!hasCards}
                        />
                        <Button
                            content="Falsch"
                            color="secondary"
                            onClick={() => handleAnswer(false)}
                            disabled={!hasCards}
                        />
                    </div>
                </>
            )}

            {(isComplete || !hasCards) && (
                <div className={stylesContainer.buttons}>
                    <Button
                        content={isComplete ? 'Neu starten' : 'Zum Karteikasten'}
                        color="primary"
                        onClick={() => {
                            if (isComplete) {
                                restartSession();
                                return;
                            }

                            router.push('/');
                        }}
                    />
                </div>
            )}
            <div ref={navMountRef} />
        </div>
    );
}
