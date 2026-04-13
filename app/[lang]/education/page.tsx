"use client";
import Education from "../../ux/Education";
import Banner from "../../ux/Banner";
import { useLanguage } from "../../hooks/LanguageProvider";

export default function EducationPage() {
  const { t } = useLanguage();
  return (
    <>
      <Banner
        bgSrc="https://images.wallpapersden.com/image/download/keyboard-keys-buttons_Z2dsbW6UmZqaraWkpJRpbG1nrWdqa2k.jpg"
        title={t("education.title")}
        subtitle={t("education.subtitle")}
        align="center"
        overlayClass="bg-black/50"
        heightClass="h-[200px] sm:h-[280px]"
      />
      <Education />
    </>
  );
}
