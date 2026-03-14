import type { Metadata } from "next";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ConditionalFooter from "../components/ConditionalFooter";
import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../hooks/LanguageProvider";
import KeepAliveGate from "../components/KeepAliveGate";

export const metadata: Metadata = {
  title: "Nilsen Tovohery – Portfolio",
  description:
    "Portfolio de Nilsen Tovohery, développeur full‑stack et administrateur systèmes basé à Fianarantsoa, Madagascar.",
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
        <div className="font-portfolio">
          <ConditionalNavbar />
          <KeepAliveGate>
            {children}
          </KeepAliveGate>
          <ConditionalFooter />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}


