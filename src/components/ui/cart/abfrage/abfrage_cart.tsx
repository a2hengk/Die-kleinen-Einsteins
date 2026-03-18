import type { Questions, QuizState } from "@/lib/types";
import styles from "./abfrage_cart.module.css";
import Input from "../../input/input";
import { Button } from "../../button/button";
import { Answer } from "@/components/abfrage/answer";

type AbfrageCartProps = {
  data: Questions;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  isFilled?: boolean;
  state: QuizState;
};

export const AbfrageCart = ({
  data,
  onChange,
  onEnter,
  isFilled,
  state,
}: AbfrageCartProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.question}>{data.question}</div>
      {state.isAnswered ? (
        <>
          {state.answers[state.currentIndex] === data.correct ? (
            <Answer
              prompt="Ihre Antwort"
              text={state.answers[state.currentIndex]}
              color="correct"
              span_color="promt_correct"
              isCorrect={true}
            />
          ) : (
            <Answer
              prompt="Ihre Antwort"
              text={isFilled ? state.answers[state.currentIndex] : "Skipped"}
              color="wrong"
              span_color="promt_wrong"
              isCorrect={false}
            />
          )}

          <Answer
            prompt="Richtige Antwort"
            text={data.correct}
            color="correct"
            span_color="promt_correct"
            isCorrect={true}
          />
        </>
      ) : (
        <>
          <Input
            onChange={onChange}
            value={state.answers[state.currentIndex] ?? ""}
            onEnter={onEnter}
          />
          <div className={styles.action}>
            <Button content="Answer" onClick={onEnter} color="secondary" />
          </div>
        </>
      )}
    </div>
  );
};
