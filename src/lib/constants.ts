import type { QuizState, Questions } from "./types";

export const initialQuizState: QuizState = {
  currentIndex: 0,
  score: 0,
  fail: 0,
  isAnswered: false,
  answers: [],
  results: []
};

export const initialQuizData: Questions[] = [
  {
    question: "What is React?",
    answer: ["Library", "Framework", "Database", "Language"],
    correct: "Library",
  },
  {
    question: "What is TypeScript?",
    answer: ["Language", "Runtime", "Database", "Browser"],
    correct: "Language",
  },
  {
    question: "Which country belongs to EU?",
    answer: ["Japan", "Russia", "USA", "Germany"],
    correct: "Germany",
  },
   {
    question: "What is the meaning of Soccer",
    answer: ["Football", "Ping-Pong", "Basketball", "Golf"],
    correct: "Football",
  },
];