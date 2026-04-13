"use client";
import Experience from "../../ux/Experience";
import Banner from "../../ux/Banner";
import { useLanguage } from "../../hooks/LanguageProvider";

export default function ExperiencePage() {
  const { t } = useLanguage();
  return (
    <>
      <Banner
        bgSrc="https://wallpapercave.com/wp/wp10599480.jpg"
        title={t("experience.title")}
        subtitle={t("experience.subtitle")}
        align="center"
        overlayClass="bg-black/50"
        heightClass="h-[200px] sm:h-[280px]"
      />
      <Experience />
    </>
  );
}
