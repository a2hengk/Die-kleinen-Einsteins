import styles from "./button.module.css";

type ButtonProps = {
  text: string;
};

export const Button = ({ text }: ButtonProps) => {
  return <button className={styles.button}>{text}</button>;
};
