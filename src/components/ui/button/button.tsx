import styles from "./button.module.css";
import { ReactNode } from "react";

type ButtonProps = {
  content?: ReactNode;
  color?: "primary" | "secondary";
  border?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  content,
  color = "primary",
  onClick,
  border = "",
  disabled = false,
}: ButtonProps) => {
  const borderClass = border ? styles[border] : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.body} ${styles[color]} ${borderClass}`.trim()}
    >
      {content}
    </button>
  );
};
