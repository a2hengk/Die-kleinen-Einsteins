import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import styles from "./learn.module.css";

export default function LernenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.header}>
        <div>Logo</div>
        <div>
          <Link href="/">
            <X />
          </Link>
        </div>
      </div>
      <>{children}</>
    </>
  );
}
