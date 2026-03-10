import { Button } from "../../button/button";
import type { Questions } from "@/lib/types";
import styles from "./learn_cart.module.css";
import { Check, X } from "lucide-react";

type FlashCartProps = {
  data: Questions;
  onAnswer: (selectedAnswer: string) => void;
  answered: boolean;
  correctAnswer: string;
  selectedAnswer: string | null;
};

export const LearnCart = ({
  data,
  onAnswer,
  answered,
  correctAnswer,
  selectedAnswer,
}: FlashCartProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.question}>{data.question}</div>
      <div className={styles.answer}>
        {data.answer.map((item, index) => {
          let borderColor: "correct" | "wrong" | "" = "";
          let active: boolean = true;
          if (answered) {
            active = false;
            if (item === correctAnswer) {
              borderColor = "correct";
            } else if (item === selectedAnswer) {
              borderColor = "wrong";
            }
          }
          return (
            <div key={index} className={styles.action_button}>
              <Button
                content={
                  active ? (
                    item
                  ) : (
                    <div className={styles.answer_button}>
                      {borderColor === "correct" ? (
                        <Check color="#5ACF67" />
                      ) : borderColor === "wrong" ? (
                        <X color="#ED8585" />
                      ) : null}
                      <span>{item}</span>
                      <div></div>
                    </div>
                  )
                }
                onClick={() => {
                  active ? onAnswer(item) : null;
                }}
                color="secondary"
                border={borderColor}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
