export type Library = {
  id: string;
  title: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Questions = {
  question: string;
  answer: string[];
  correct: string;
};

export type QuizState = {
  currentIndex: number;
  score: number;
  fail: number;
  selectedAnswer: boolean;
  results: ("correct" | "wrong" | "skipped")[]
};

export type Action =
  | { type: "ANSWER"; payload: boolean }
  | { type: "NEXT" }
  | { type: "RESTART" };