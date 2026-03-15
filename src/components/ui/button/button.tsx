import styles from "./button.module.css";
import { ReactNode } from "react";

type ButtonProps = {
  content?: ReactNode;
  color?: "primary" | "secondary";
  border?: string;
  onClick?: () => void;
};

export const Button = ({
  content,
  color = "primary",
  onClick,
  border = "",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.body} ${styles[color]} ${styles[border]}`}
    >
      {content}
    </button>
  );
};
