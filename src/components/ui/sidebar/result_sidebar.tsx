import { Check, X, CircleAlert } from "lucide-react";
import styles from "./result_sidebar.module.css";
import { QuizState } from "@/lib/types";

interface PageProps {
  data: QuizState;
  onClick: (selectedIndex: number) => void;
}

export const ResultSidebar = ({ data, onClick }: PageProps) => {
  return (
    <div className={styles.sidebar}>
      {data.results.map((item, index) => (
        <div key={index} className={styles.item} onClick={() => onClick(index)}>
          <span className={styles.icon}>
            {item === "correct" && <Check color="#5ACF67" />}
            {item === "wrong" && <X color="#ED8585" />}
            {item === "skipped" && <CircleAlert />}
          </span>
          <span className={styles.number}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
};
