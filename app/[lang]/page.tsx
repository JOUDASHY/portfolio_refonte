"use client";

import Hero from "../ux/Hero";
import About from "../ux/About";
import Skills from "../ux/Skills";
import Education from "../ux/Education";
import Projects from "../ux/Projects";
import Experience from "../ux/Experience";
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
      <Banner
        bgSrc="https://itechgems.com/img/web%20development%20highresolution.jfif"
        title={t("banner.webDev")}
        subtitle={t("banner.webDevSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />

      <About />
      <Banner
        bgSrc="https://intradys.com/wp-content/uploads/2021/06/keyboard_unsplash-2000x1200.jpg"
        title={t("banner.fullStack")}
        subtitle={t("banner.fullStackSubtitle")}
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
        bgSrc="https://apprendre-la-programmation.net/images/formation-developpeur-web.jpg"
        title={t("banner.sysAdmin")}
        subtitle={t("banner.sysAdminSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Projects />
      <Banner
        bgSrc="https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        title={t("banner.fullStack")}
        subtitle={t("banner.fullStackSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Experience />
      <Banner
        bgSrc="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dit-jSj7hA_Y&psig=AOvVaw2MODuce4oSA5CaPg1Lp8gs&ust=1759584555746000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNiH78mRiJADFQAAAAAdAAAAABAL"
        title={t("banner.collaboration")}
        subtitle={t("banner.collaborationSubtitle")}
        align="center"
        overlayClass="bg-black/30"
      />
      <Contact />
      <SocialDock />
    </div>
  );
}


