"use client";
import Skills from "../../ux/Skills";
import Banner from "../../ux/Banner";
import { useLanguage } from "../../hooks/LanguageProvider";

export default function SkillsPage() {
  const { t } = useLanguage();
  return (
    <>
      <Banner
        bgSrc="https://wallpapercave.com/wp/wp10599480.jpg"
        title={t("skills.title")}
        subtitle={t("skills.subtitle")}
        align="center"
        overlayClass="bg-black/50"
        heightClass="h-[200px] sm:h-[280px]"
      />
      <Skills />
    </>
  );
}
