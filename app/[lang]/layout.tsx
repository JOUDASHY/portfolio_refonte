import type { Metadata } from "next";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ConditionalFooter from "../components/ConditionalFooter";
import { ThemeProvider } from "../components/ThemeProvider";
import { LanguageProvider } from "../hooks/LanguageProvider";
import KeepAliveGate from "../components/KeepAliveGate";
import ToastProvider from "../components/ToastProvider";

const siteUrl = "https://portfolio.unityfianar.site";

const metaByLang: Record<string, Metadata> = {
  fr: {
    title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
    description:
      "Développeur fullstack et administrateur système avec 2 ans d'expérience, je conçois des solutions web performantes, sécurisées et évolutives.",
    keywords: [
      "Nilsen",
      "Nilsen Tovohery",
      "Nilsen développeur",
      "Nilsen admin sys",
      "Nilsen administrateur système",
      "Nilsen fullstack",
      "Nilsen Madagascar",
      "Nilsen Fianarantsoa",
      "développeur fullstack Madagascar",
      "administrateur système Madagascar",
      "développeur web Fianarantsoa",
      "portfolio développeur Madagascar",
    ],
    openGraph: {
      title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
      description:
        "Découvrez les projets et compétences de Nilsen Tovohery, développeur full‑stack et administrateur systèmes à Fianarantsoa, Madagascar.",
      url: `${siteUrl}/fr`,
      siteName: "Portfolio Nilsen Tovohery",
      locale: "fr_FR",
      alternateLocale: ["en_US"],
      images: [{ url: "/nilsen-Photoroom.png", width: 968, height: 768, alt: "Nilsen Tovohery – Développeur Full‑Stack" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nilsen Tovohery – Développeur Full‑Stack & Admin Sys",
      description: "Portfolio de Nilsen Tovohery, développeur full‑stack et administrateur systèmes à Fianarantsoa, Madagascar.",
      images: ["/nilsen-Photoroom.png"],
    },
    alternates: {
      canonical: `${siteUrl}/fr`,
      languages: {
        "fr": `${siteUrl}/fr`,
        "en": `${siteUrl}/en`,
      },
    },
  },
  en: {
    title: "Nilsen Tovohery – Full‑Stack Developer & Sys Admin",
    description:
      "Full-stack developer and system administrator with 2 years of experience, designing performant, secure and scalable web solutions.",
    keywords: [
      "Nilsen",
      "Nilsen Tovohery",
      "Nilsen developer",
      "Nilsen sys admin",
      "Nilsen system administrator",
      "Nilsen fullstack",
      "Nilsen Madagascar",
      "Nilsen Fianarantsoa",
      "fullstack developer Madagascar",
      "system administrator Madagascar",
      "web developer Fianarantsoa",
      "developer portfolio Madagascar",
    ],
    openGraph: {
      title: "Nilsen Tovohery – Full‑Stack Developer & Sys Admin",
      description:
        "Discover the projects and skills of Nilsen Tovohery, full-stack developer and system administrator based in Fianarantsoa, Madagascar.",
      url: `${siteUrl}/en`,
      siteName: "Nilsen Tovohery Portfolio",
      locale: "en_US",
      alternateLocale: ["fr_FR"],
      images: [{ url: "/nilsen-Photoroom.png", width: 968, height: 768, alt: "Nilsen Tovohery – Full‑Stack Developer" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nilsen Tovohery – Full‑Stack Developer & Sys Admin",
      description: "Portfolio of Nilsen Tovohery, full-stack developer and system administrator based in Fianarantsoa, Madagascar.",
      images: ["/nilsen-Photoroom.png"],
    },
    alternates: {
      canonical: `${siteUrl}/en`,
      languages: {
        "fr": `${siteUrl}/fr`,
        "en": `${siteUrl}/en`,
      },
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return metaByLang[lang] ?? metaByLang["fr"];
}

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
          <ToastProvider />
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


