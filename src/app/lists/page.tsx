import Link from "next/link";
import styles from "./lists.module.css";

export default function ListPage() {
  return (
    <div className={styles.container}>
      <h1>Lists</h1>
      <p>you can here your work freely ;)</p>
      <Link href="/" className={styles.backLink}>Back to home</Link>
    </div>
  );
}
