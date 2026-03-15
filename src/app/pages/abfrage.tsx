"use client";

import { Button } from "@/components/ui/button/button";
import styles from "./../styles/abfrage-styles/blast.module.css";
import { AbfrageCart } from "@/components/ui/cart/abfrage/abfrage_cart";
import { initialQuizData, initialQuizState } from "@/lib/constants";
import { Action, QuizState } from "@/lib/types";
import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { Result } from "@/components/test/result";

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "ANSWER":
      const updatedAnswers = [...state.answers];
      updatedAnswers[state.currentIndex] = action.answer;
      return {
        ...state,
        isAnswered: true,
        score: action.payload ? state.score + 1 : state.score,
        fail: action.payload ? state.fail : state.fail + 1,
        answers: updatedAnswers,
        results: [...state.results, action.payload ? "correct" : "wrong"],
      };

    case "NEXT":
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        isAnswered: false,
      };

    case "SHOW":
      return {
        ...state,
        currentIndex: action.payload,
      };

    case "RESTART":
      return initialQuizState;

    default:
      return state;
  }
}

export default function abfrage() {
  const [state, dispatch] = useReducer(reducer, initialQuizState);
  const [isFilled, setIsFilled] = useState(true);
  const [answer, setAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const currentQuestion = initialQuizData[state.currentIndex];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    setIsFilled(true);
  };

  const handleAnswer = () => {
    if (state.isAnswered) return;

    if (answer.trim() === "") setIsFilled(false);
    else setIsFilled(true);

    const isCorrect = answer === currentQuestion.correct;

    dispatch({ type: "ANSWER", payload: isCorrect, answer: answer });
  };

  const handleNext = () => {
    if (state.currentIndex + 1 < initialQuizData.length) {
      dispatch({ type: "NEXT" });
    } else {
      setIsFinished(true);
    }
  };

  return (
    <>
      <div className={styles.container}>
        {isFinished ? (
          <div className={styles.resultWrapper}>
            <Result data={state} />
          </div>
        ) : (
          <div>
            <AbfrageCart
              data={currentQuestion}
              onEnter={handleAnswer}
              onChange={onChange}
              isFilled={isFilled}
              state={state}
            />
            {state.isAnswered && (
              <div className={styles.action_container}>
                <Button
                  content="Continue"
                  color="primary"
                  onClick={handleNext}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
