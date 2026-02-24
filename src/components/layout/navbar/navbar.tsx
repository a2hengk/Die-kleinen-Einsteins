"use client";

import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <button className={styles.burger} onClick={() => setOpen(!open)}>
            ☰
          </button>

          <span className={styles.logo}>Logo</span>

          {/* Desktop Links */}
          <ul className={styles.navLinks}>
            <li>
              <Link href="/lists">Tools</Link>
            </li>
          </ul>
        </div>

        <div className={styles.right}>
          <Button text="Sign up"></Button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.show : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <ul>
          <Link href="/">Tools</Link>
        </ul>
      </div>
    </>
  );
}
