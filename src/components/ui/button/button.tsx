import styles from "./button.module.css";
import { ReactNode } from "react";

type ButtonProps = {
  content: ReactNode;
  onClick?: () => void;
};

export const Button = ({ content, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {content}
    </button>
  );
};
