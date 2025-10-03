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

export default function Home() {
  // Enregistrement automatique des visites
  useVisitTracker();
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Banner
        bgSrc="https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        title="Web Developer & DevOps Specialist"
        subtitle="Crafting and optimizing scalable web solutions"
        align="center"
        overlayClass="bg-black/30"
      />
      <Experience />
      <Banner
        bgSrc="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dit-jSj7hA_Y&psig=AOvVaw2MODuce4oSA5CaPg1Lp8gs&ust=1759584555746000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNiH78mRiJADFQAAAAAdAAAAABAL"
        title="Construisons quelque chose d'exceptionnel"
        subtitle="Disponible pour des missions et collaborations"
        align="center"
        overlayClass="bg-black/30"
      />
      <Contact />
      <SocialDock />
    </div>
  );
}


