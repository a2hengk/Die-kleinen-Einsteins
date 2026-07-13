export type Flashcard = {
  id: number;
  front: string;
  back: string;
};

export type CardProgress = {
  cardId: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt: string | null;
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
  isAnswered: boolean;
  answers: (string | null)[];
  results: ("correct" | "wrong" | "skipped")[]
};

export type Action =
  | { type: "ANSWER"; payload: boolean; answer: string }
  | { type: "NEXT" }
  | { type: "SHOW"; payload: number }
  | { type: "RESTART" };