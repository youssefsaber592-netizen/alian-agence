"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollProgress } from "./ScrollProgress";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </LanguageProvider>
  );
}
