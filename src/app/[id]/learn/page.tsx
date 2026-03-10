"use client";

import { useState } from "react";
import styles from "./learn.module.css";
import { TestCart } from "@/components/ui/cart/test/test_cart";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import { initialQuizData } from "@/lib/constants";
import { Questions } from "@/lib/types";

interface PageProps {
  params: {
    id: string;
  };
}

export default function LearnPage({ params }: PageProps) {
  //const { id } = params;
  const [data] = useState<Questions[]>(initialQuizData);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentQuestion = initialQuizData[currentIndex];
  const changeQuestion = (upOrDown: string) => {
    if (upOrDown === "up" && currentIndex + 1 < initialQuizData.length) {
      setCurrentIndex(currentIndex + 1);
    } else if (upOrDown === "down" && currentIndex >= 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  return (
    <>
      <div className={styles.header}>
        <div>Logo</div>
        <div>
          <Link href="/">
            <X />
          </Link>
        </div>
      </div>
      <div className={styles.container}>
        <TestCart data={currentQuestion} />
        <div className={styles.action_info}>
          <Button
            content={<ChevronLeft />}
            onClick={() => {
              changeQuestion("down");
            }}
          />
          <span>
            {currentIndex + 1} / {data.length}
          </span>
          <Button
            content={<ChevronRight />}
            onClick={() => {
              changeQuestion("up");
            }}
          />
        </div>
      </div>
    </>
  );
}
