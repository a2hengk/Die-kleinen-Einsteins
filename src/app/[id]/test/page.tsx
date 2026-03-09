"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { LearnCart } from "@/components/ui/cart/learn/learn_cart";
import { Action, QuizState } from "../../../lib/types";
import { initialQuizState, initialQuizData } from "../../../lib/constants";

import styles from "./test_page.module.css";
import { Result } from "./result";

export default function TestPage() {
  const [state, dispatch] = useReducer(reducer, initialQuizState);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = initialQuizData[state.currentIndex];

  function reducer(state: QuizState, action: Action): QuizState {
    switch (action.type) {
      case "ANSWER":
        return {
          ...state,
          selectedAnswer: true,
          score: action.payload ? state.score + 1 : state.score,
          fail: action.payload ? state.fail : state.fail + 1,
          results: [...state.results, action.payload ? "correct" : "wrong"],
        };

      case "NEXT":
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          selectedAnswer: false,
        };

      case "RESTART":
        return initialQuizState;

      default:
        return state;
    }
  }

  function handleAnswer(selectedAnswer: string) {
    if (state.selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;

    dispatch({ type: "ANSWER", payload: isCorrect });

    if (state.currentIndex + 1 < initialQuizData.length) {
      dispatch({ type: "NEXT" });
    } else {
      setIsFinished(true);
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div>Logo</div>
        <div className={styles.action_info}>
          <p>
            {state.currentIndex + 1} / {initialQuizData.length}
          </p>
          <p>Learn Algorithm von Lehrerin</p>
        </div>
        <div>
          <Link href="/">
            <X />
          </Link>
        </div>
      </div>

      <div className={styles.container}>
        {isFinished ? <Result data={state} /> : null}
        <LearnCart
          data={currentQuestion}
          onAnswer={handleAnswer}
          answered={state.selectedAnswer}
          correctAnswer={currentQuestion.correct}
        />
      </div>
    </>
  );
}
