import DonutChart from "@/components/ui/chart/donut_chart";
import styles from "./result.module.css";
import { QuizState } from "@/lib/types";

interface PageProps {
  data: QuizState;
}

export const Result = ({ data }: PageProps) => {
  return (
    <>
      <div className={styles.motivation}>
        <span>Keep going you were great!</span>
      </div>
      <div className={styles.info_container}>
        <DonutChart data={[data.score, data.fail]} />
        <div className={styles.info_text}>
          <p className={styles.correct}>Richtig: {data.score}</p>
          <p className={styles.wrong}>Falsch: {data.fail}</p>
          <p className={styles.skip}>Übersprungen: -</p>
        </div>
      </div>
    </>
  );
};
