import type { Metadata } from "next";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ConditionalFooter from "../components/ConditionalFooter";
import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../hooks/LanguageProvider";
import KeepAliveGate from "../components/KeepAliveGate";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Nilsen Portfolio",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const initialLang = lang === "fr" ? "fr" : "en";
  return (
    <ThemeProvider>
      <LanguageProvider initialLang={initialLang}>
        <ConditionalNavbar />
        <KeepAliveGate>
          {children}
        </KeepAliveGate>
        <ConditionalFooter />
      </LanguageProvider>
    </ThemeProvider>
  );
}


