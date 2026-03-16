"use client";

import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import StatusBar from '../../components/ui/statusbar/statusbar';
import { Button } from '../../components/ui/button/button';

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
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 10;
  const navMountRef = useRef<HTMLDivElement | null>(null);


  // Navbar setup

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
        if (itemId === "selbstlernen") {
          return;
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
  }, []);

  // end Navbar setup

  return (
    <div className={stylesContainer.primary}>
      <StatusBar correctCount={correctCount} wrongCount={wrongCount} currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
      <div 
        className={`${stylesContainer.card} ${isFlipped ? stylesContainer.flipover : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {isFlipped ? 'Flipped Content' : 'Original Content'}
      </div>
      <div className={stylesContainer.buttons}>
        <Button content="Correct" color="primary" onClick={() => {
          setCorrectCount(correctCount + 1);
          if (currentQuestion < totalQuestions) setCurrentQuestion(currentQuestion + 1);
        }} />
        <Button content="Wrong" color="secondary" onClick={() => {
          setWrongCount(wrongCount + 1);
          if (currentQuestion < totalQuestions) setCurrentQuestion(currentQuestion + 1);
        }} />
      </div>
      <div ref={navMountRef} />
    </div>
  );
}