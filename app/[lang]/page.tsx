import Hero from "../ux/Hero";
import About from "../ux/About";
import Skills from "../ux/Skills";
import Education from "../ux/Education";
import Projects from "../ux/Projects";
import Experience from "../ux/Experience";
import Contact from "../ux/Contact";
import Banner from "../ux/Banner";
import SocialDock from "../ux/SocialDock";

export default function Home() {
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
        bgSrc="https://img.freepik.com/photos-gratuite/beaux-bureaux-dans-style-dessins-animes_23-2151043338.jpg?semt=ais_hybrid&w=740&q=80"
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


