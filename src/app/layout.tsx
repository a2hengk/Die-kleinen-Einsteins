import styles from "./layout.module.css";
import "../../Component.css";
import { Roboto } from "next/font/google";
import type { Metadata } from "next";

const { SITE_NAME } = process.env;

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Developed by Die Kleinen Einsteins",
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-large-text="false"
      data-high-contrast="false"
      data-reduced-motion="false"
      data-auto-focus-input="true"
      suppressHydrationWarning
    >
      <body className={`${styles.body} ${roboto.className}`}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
