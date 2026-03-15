import type { Questions, QuizState } from "@/lib/types";
import styles from "./abfrage_cart.module.css";
import Input from "../../input/input";
import { Button } from "../../button/button";
import { Answer } from "@/components/blast/answer";

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
        <div>
          <Answer
            prompt="Ihre Antwort"
            text={isFilled ? state.answers[state.currentIndex] : "Skipped"}
            color="current"
            span_color="promt_current"
            isCurrent={true}
          />

          <Answer
            prompt="Richtige Antwort"
            text={data.correct}
            color="correct"
            span_color="promt_correct"
            isCurrent={false}
          />
        </div>
      ) : (
        <div>
          <Input
            onChange={onChange}
            value={state.answers[state.currentIndex] ?? ""}
            onEnter={onEnter}
          />
          <div className={styles.action}>
            <Button content="Answer" onClick={onEnter} />
          </div>
        </div>
      )}
    </div>
  );
};
