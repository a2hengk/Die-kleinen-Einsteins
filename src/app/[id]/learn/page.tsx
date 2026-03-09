import styles from "./learn.module.css";
import { TestCart } from "@/components/ui/cart/test/test_cart";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button/button";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LearnPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className={styles.container}>
      <TestCart />
      <div className={styles.action_info}>
        <Button content={<ChevronLeft />} />
        <p>
          {"1"} / {"3"}
        </p>
        <Button content={<ChevronRight />} />
      </div>
    </div>
  );
}
