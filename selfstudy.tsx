"use client";

import { createInfoModal } from '../../../components/infoModal';
import { createSettingsModal } from '../../../components/settingsModal';
import { mountFloatingNavBar } from '../../../components/floatingNavBar';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import stylesStatusbar from '../styles/selfstudy-styles/statusbar.module.css';
import stylesBody from '../styles/overview-styles/body.module.css';

export default function SelfStudy() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const navMountRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
        if (itemId === 'selbstlernen') {
          router.push('/selfstudy');
        }

        if (itemId === 'abfragen') {
          router.push('/abfrage');
        }
      },
      onOpenInfo: () => {
        infoModalController.open();
      },
      onOpenSettings: () => {
        settingsModalController.open();
      }
    });

    const selbstlernenButton = navMountRef.current.querySelector<HTMLButtonElement>(
      '[data-nav-id="selbstlernen"]'
    );
    const karteikastenButton = navMountRef.current.querySelector<HTMLButtonElement>(
      '[data-nav-id="karteikasten"]'
    );

    karteikastenButton?.classList.remove('is-active');
    karteikastenButton?.setAttribute('aria-current', 'false');
    selbstlernenButton?.classList.add('is-active');
    selbstlernenButton?.setAttribute('aria-current', 'page');

    return () => {
      navController.destroy();
      infoModalController.destroy();
      settingsModalController.destroy();
    };
  }, [router]);

  return (
    <div className={stylesContainer.container}>
      <h1 className={stylesContainer.title}>Self Study</h1>
      <main className={stylesBody.body}>
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
          <button className={stylesContainer.showAnswer}>Show Answer</button>
        </div>
      </main>
      <div ref={navMountRef} />
    </div>
  );
}
