"use client";

import { useState } from 'react';
import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import stylesStatusbar from '../styles/selfstudy-styles/statusbar.module.css';
import stylesBody from '../styles/overview-styles/body.module.css';

export default function SelfStudy() {
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  return (
    <div className={stylesContainer.container}>
      <h1 className={stylesContainer.title}>Self Study</h1>
      <main className={stylesBody.body}>
        <div className={stylesStatusbar.statusbar}>
          <span>Correct: <span className={stylesStatusbar.correctCount}>{correctCount}</span></span>
          <span>Wrong: <span className={stylesStatusbar.wrongCount}>{wrongCount}</span></span>
        </div>
        <div className={stylesContainer.card}></div>
        <div className={stylesContainer.buttons}>
          <button className={stylesContainer.right} onClick={() => setCorrectCount(correctCount + 1)}>Correct</button>
          <button className={stylesContainer.wrong} onClick={() => setWrongCount(wrongCount + 1)}>Wrong</button>
          <button className={stylesContainer.showAnswer}>Show Answer</button>
        </div>
      </main>
    </div>
  );
}