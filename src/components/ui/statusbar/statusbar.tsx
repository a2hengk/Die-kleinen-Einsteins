"use client";

import styles from "./statusbar.module.css";

interface StatusBarProps {
  correctCount: number;
  wrongCount: number;
  currentQuestion?: number;
  totalQuestions?: number;
}

export default function StatusBar({ correctCount, wrongCount, currentQuestion = 1, totalQuestions = 10 }: StatusBarProps) {
  const correctBoxes = Array.from({ length: Math.max(0, correctCount) });
  const wrongBoxes = Array.from({ length: Math.max(0, wrongCount) });

  return (
    <div className={styles.statusbar}>
      <div className={styles.label}>
        {totalQuestions > 0 ? `Frage ${currentQuestion} / ${totalQuestions}` : "Noch keine Lernkarten"}
      </div>

      <div className={styles.counts}>
        <span className={styles.correctText}>Richtig: {correctCount}</span>
        <span className={styles.wrongText}>Falsch: {wrongCount}</span>
      </div>

      <div className={styles.boxesContainer}>
        {correctBoxes.map((_, index) => (
          <div key={`correct-${index}`} className={`${styles.box} ${styles.boxCorrect}`} />
        ))}
        {wrongBoxes.map((_, index) => (
          <div key={`wrong-${index}`} className={`${styles.box} ${styles.boxWrong}`} />
        ))}
      </div>
    </div>
  );
}
