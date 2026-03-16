import styles from "./answer.module.css";
import { X, Check } from "lucide-react";

type AnswerProps = {
  prompt: string;
  text: string | null;
  color: string;
  span_color: string;
  isCorrect: boolean;
};

export const Answer = ({
  prompt,
  text,
  color,
  span_color,
  isCorrect,
}: AnswerProps) => {
  return (
    <div className={styles.container}>
      <span className={`${styles[span_color]}`}>{prompt}</span>
      <div className={`${styles.answer_container} ${styles[color]}`}>
        {!isCorrect ? <X color="#ED8585" /> : <Check color="#5ACF67" />}
        <span>{text}</span>
      </div>
    </div>
  );
};
