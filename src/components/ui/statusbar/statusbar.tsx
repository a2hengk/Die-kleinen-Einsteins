"use client";

import styles from "./statusbar.module.css";
import { useState, useEffect } from "react";

interface StatusBarProps {
  correctCount: number;
  wrongCount: number;
  currentQuestion?: number;
  totalQuestions?: number;
}

export default function StatusBar({ correctCount, wrongCount, currentQuestion = 1, totalQuestions = 10 }: StatusBarProps) {
  const [boxes, setBoxes] = useState<Array<{ id: number; type: "correct" | "wrong" }>>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Add a new box for each count change
    const correctBoxCount = boxes.filter((b) => b.type === "correct").length;
    const wrongBoxCount = boxes.filter((b) => b.type === "wrong").length;

    if (correctBoxCount < correctCount) {
      const newBox = { id: nextId, type: "correct" as const };
      setBoxes([...boxes, newBox]);
      setNextId(nextId + 1);

      const timer = setTimeout(() => {
        setBoxes((prev) => prev.filter((box) => box.id !== newBox.id));
      }, 2000);

      return () => clearTimeout(timer);
    } else if (wrongBoxCount < wrongCount) {
      const newBox = { id: nextId, type: "wrong" as const };
      setBoxes([...boxes, newBox]);
      setNextId(nextId + 1);

      const timer = setTimeout(() => {
        setBoxes((prev) => prev.filter((box) => box.id !== newBox.id));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [correctCount, wrongCount, boxes, nextId]);

  return (
    <div className={styles.statusbar}>
      <div className={styles.container}>
        <div className={styles.label}>Question {currentQuestion} / {totalQuestions}</div>
      </div>

      <div className={styles.container}>
        <div className={styles.label}></div>
        <div className={styles.boxesContainer}>
          {boxes.map((box) => (
            <div
              key={box.id}
              className={`${styles.box} ${
                box.type === "correct" ? styles.boxCorrect : styles.boxWrong
              }`}
            />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.label}></div>
      </div>
    </div>
  );
}
