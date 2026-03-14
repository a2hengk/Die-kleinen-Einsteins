import styles from "./header.module.css";
import Link from "next/link";
import { X } from "lucide-react";

interface PageProps {
  currentIndex?: number;
  totalIndex?: number;
  isAddition?: boolean;
  title?: string;
}

export const Header = ({
  currentIndex,
  totalIndex,
  isAddition,
  title,
}: PageProps) => {
  return (
    <div className={styles.header}>
      <Link href="/">
        <div>Logo</div>
      </Link>
      {isAddition && (
        <div className={styles.action_info}>
          <p>
            {currentIndex} / {totalIndex}
          </p>
          <p>{title}</p>
        </div>
      )}
      <div>
        <Link href="/">
          <X />
        </Link>
      </div>
    </div>
  );
};
