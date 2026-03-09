import { Button } from "../../button/button";
import type { Questions } from "@/lib/types";
import styles from "./learn_cart.module.css";

type FlashCartProps = {
  data: Questions;
  onAnswer: (selectedAnswer: string) => void;
  answered: boolean;
  correctAnswer: string;
};

export const LearnCart = ({ data, onAnswer }: FlashCartProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.question}>{data.question}</div>
      <div className={styles.answer}>
        {data.answer.map((item, index) => (
          <div key={index} className={styles.action_button}>
            <Button content={item} onClick={() => onAnswer(item)} />
          </div>
        ))}
      </div>
    </div>
  );
};
