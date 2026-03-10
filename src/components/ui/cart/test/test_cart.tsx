import { useState } from "react";
import styles from "./test_cart.module.css";
import { Questions } from "@/lib/types";

interface PageProps {
  data: Questions;
}

export function TestCart({ data }: PageProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={styles.card_container}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        {/* Front-side */}
        <div className={styles.front}>
          <p>{data.question}</p>
        </div>

        {/* Back-side */}
        <div className={styles.back}>
          <p>{data.correct}</p>
        </div>
      </div>
    </div>
  );
}
