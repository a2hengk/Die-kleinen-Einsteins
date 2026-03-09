"use client";

import { useState } from "react";
import styles from "./test_cart.module.css";

export function TestCart () {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className={styles.card_container}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        {/* Vorderseite */}
        <div className={styles.front}>
          <h2>Frage</h2>
          <p>Was ist React?</p>
        </div>

        {/* Rückseite */}
        <div className={styles.back}>
          <h2>Antwort</h2>
          <p>Eine JavaScript Library für UI</p>
        </div>
      </div>
    </div>
  );
};
