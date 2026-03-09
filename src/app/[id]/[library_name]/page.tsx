"use client";

import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { use, useEffect } from "react";

interface PageProps {
  params: Promise<{
    library_name: string;
    id: string;
  }>;
}

export default function UserLibraryPage({ params }: PageProps) {
  const { library_name, id } = use(params);
  useEffect(() => {
    console.log("params: ", id, library_name);
  }, []);
  return (
    <>
      <Navbar />
      <p>
        Internal details of the {library_name} with id nummer: {id}
      </p>
      <Footer />
    </>
  );
}
