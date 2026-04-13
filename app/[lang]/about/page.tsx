"use client";
import About from "../../ux/About";
import Banner from "../../ux/Banner";
import { useLanguage } from "../../hooks/LanguageProvider";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <Banner
        bgSrc="https://wallpaperaccess.com/full/5675692.jpg"
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        align="center"
        overlayClass="bg-black/50"
        heightClass="h-[200px] sm:h-[280px]"
      />
      <About />
    </>
  );
}
