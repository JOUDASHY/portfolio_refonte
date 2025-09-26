import type { Metadata } from "next";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ConditionalFooter from "../components/ConditionalFooter";
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
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </LanguageProvider>
    </ThemeProvider>
  );
}


