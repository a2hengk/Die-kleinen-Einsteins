import DonutChart from "@/components/ui/chart/donut_chart";
import styles from "./result.module.css";
import { QuizState } from "@/lib/types";
import { Check, X, CircleAlert } from "lucide-react";

interface PageProps {
  data: QuizState;
}

export const Result = ({ data }: PageProps) => {
  return (
    <>
      <span>Hier ist das Ergebnis ;)</span>
      <div className={styles.info_container}>
        <DonutChart data={[data.score, data.fail]} />
        <div className={styles.info_text}>
          <p>Richtig: {data.score}</p>
          <p>Falsch: {data.fail}</p>
          <p>Übersprungen: -</p>
        </div>
      </div>
      <div className={styles.sidebar}>
        {data.results.map((item, index) => (
          <div key={index} className={styles.item}>
            <span className={styles.icon}>
              {item === "correct" && <Check color="#5ACF67" />}
              {item === "wrong" && <X color="#ED8585" />}
              {item === "skipped" && <CircleAlert />}
            </span>

            <span className={styles.number}>{index + 1}</span>
          </div>
        ))}
      </div>
    </>
  );
};
