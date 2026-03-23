"use client";

import Hero from "../ux/Hero";
import About from "../ux/About";
import Skills from "../ux/Skills";
import Education from "../ux/Education";
import Projects from "../ux/Projects";
import Gallery from "../ux/Gallery";
import Experience from "../ux/Experience";
import Internships from "../ux/Internships";
import Contact from "../ux/Contact";
import Banner from "../ux/Banner";
import SocialDock from "../ux/SocialDock";
import { useVisitTracker } from "../hooks/useVisitTracker";
import { useLanguage } from "../hooks/LanguageProvider";

export default function Home() {
  // Enregistrement automatique des visites
  useVisitTracker();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Hero />
      {/* <Banner
        bgSrc="https://cdn.britannica.com/76/5376-050-D9A5C5ED/flora-fauna-Madagascar-Thicket-family-members-Mandrare.jpg"
        title={t("banner.webDev")}
        subtitle={t("banner.webDevSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      /> */}

      <About />
      <Banner
        bgSrc="https://wallpaperaccess.com/full/5675692.jpg"
        // bgSrc="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dit-jSj7hA_Y&psig=AOvVaw2MODuce4oSA5CaPg1Lp8gs&ust=1759584555746000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNiH78mRiJADFQAAAAAdAAAAABAL"
        title={t("banner.collaboration")}
        subtitle={t("banner.collaborationSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Skills />
      <Banner
        bgSrc="https://wallpapercave.com/wp/wp10599480.jpg"
        title={t("banner.techExpert")}
        subtitle={t("banner.techExpertSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Education />
      <Banner
        bgSrc="https://images.wallpapersden.com/image/download/keyboard-keys-buttons_Z2dsbW6UmZqaraWkpJRpbG1nrWdqa2k.jpg"
        title={t("banner.sysAdmin")}
        subtitle={t("banner.sysAdminSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Projects />
      <Gallery />

      {/* <Banner
        bgSrc="https://img.freepik.com/premium-photo/creative-photographer-minimalist-desk-flatlay-generative-ai_1416-24896.jpg"
        title="Momentum & Créativité"
        subtitle="Capturer l'essence de chaque instant à travers mon objectif"
        align="center"
        overlayClass="bg-black/30"
      /> */}
      <Experience />
      <Contact />

      <SocialDock />
      <Internships />

    </div>
  );
}


