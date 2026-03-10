"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { LearnCart } from "@/components/ui/cart/learn/learn_cart";
import { Action, QuizState } from "../../../lib/types";
import { initialQuizState, initialQuizData } from "../../../lib/constants";
import styles from "./test_page.module.css";
import { Result } from "./result";
import { ResultSidebar } from "@/components/ui/sidebar/result_sidebar";

export default function TestPage() {
  const [state, dispatch] = useReducer(reducer, initialQuizState);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = initialQuizData[state.currentIndex];

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

  const handleAnswer = (selectedAnswer: string) => {
    if (state.isAnswered) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;

    dispatch({ type: "ANSWER", payload: isCorrect, answer: selectedAnswer });

    if (state.currentIndex + 1 < initialQuizData.length) {
      dispatch({ type: "NEXT" });
    } else {
      setIsFinished(true);
    }
  };

  const showAnswer = (selectedIndex: number) => {
    dispatch({ type: "SHOW", payload: selectedIndex });
  };

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
        {isFinished && (
          <div className={styles.resultWrapper}>
            <ResultSidebar data={state} onClick={showAnswer} />
            <Result data={state} />
          </div>
        )}
        <LearnCart
          data={currentQuestion}
          onAnswer={handleAnswer}
          answered={state.isAnswered}
          correctAnswer={currentQuestion.correct}
          selectedAnswer={state.answers[state.currentIndex]}
        />
      </div>
    </>
  );
}
