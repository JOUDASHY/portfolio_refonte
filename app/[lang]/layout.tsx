import type { Metadata } from "next";
import Navbar from "../ux/Navbar";
import Footer from "../ux/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../hooks/LanguageProvider";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Nilsen Portfolio",
};

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "en" | "fr" };
}) {
  const initialLang = params.lang === "fr" ? "fr" : "en";
  return (
    <ThemeProvider>
      <LanguageProvider initialLang={initialLang}>
        <Navbar />
        {children}
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  );
}


