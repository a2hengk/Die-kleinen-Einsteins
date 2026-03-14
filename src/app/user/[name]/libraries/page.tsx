import Link from "next/link";
import styles from "./user_name_libraries.module.css";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Footer } from "@/components/layout/footer/footer";

interface PageProps {
  params: {
    name: string;
  };
}

export default async function UserLibrariesPage({ params }: PageProps) {
  const { name } = await params;
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>{name}</h1>
        <p>you can here your work freely ;)</p>
        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
      </div>
      <Footer />
    </>
  );
}
