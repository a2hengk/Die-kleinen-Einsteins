import { Navbar } from "@/components/layout/navbar/navbar";
import styles from "./page.module.css";
import { Footer } from "@/components/layout/footer/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <h1>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem
      </h1>
      <h1> Carousel </h1>
      <Footer />
    </>
  );
}
