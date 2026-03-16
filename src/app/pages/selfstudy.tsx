"use client";

import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import stylesStatusbar from '../styles/selfstudy-styles/statusbar.module.css';

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
      <div className={stylesStatusbar.statusbar}>
        <span>Correct: <span className={stylesStatusbar.correctCount}>{correctCount}</span></span>
        <span>Wrong: <span className={stylesStatusbar.wrongCount}>{wrongCount}</span></span>
      </div>
      <div className={stylesContainer.card} onClick={() => setIsFlipped(!isFlipped)}>
        {isFlipped ? 'Flipped Content' : 'Original Content'}
      </div>
      <div className={stylesContainer.buttons}>
        <button className={stylesContainer.right} onClick={() => setCorrectCount(correctCount + 1)}>Correct</button>
        <button className={stylesContainer.wrong} onClick={() => setWrongCount(wrongCount + 1)}>Wrong</button>
      </div>
      <div ref={navMountRef} />
    </div>
  );
}