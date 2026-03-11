"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Icon URLs
const icons = [
  { name: "Laravel", url: "https://img.icons8.com/?size=100&id=114956&format=png&color=000b31" },
  { name: "React", url: "https://img.icons8.com/?size=100&id=122637&format=png&color=000b31" },
  { name: "Django", url: "https://img.icons8.com/?size=100&id=37o3DqV429ra&format=png&color=000b31" },
  { name: "Next.js", url: "https://img.icons8.com/?size=100&id=gwR0hbBi5JeZ&format=png&color=000b31" },
];

export default function Internships() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled half the content (since content is duplicated)
      const halfWidth = container.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      
      container.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Duplicate icons for seamless infinite scroll
  const duplicatedIcons = [...icons, ...icons, ...icons, ...icons, ...icons, ...icons, ...icons, ...icons];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div className="flex" style={{ width: 'fit-content' }}>
        <div ref={scrollRef} className="flex">
          {duplicatedIcons.map((icon, idx) => (
            <div
              key={`${icon.name}-${idx}`}
              className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 mx-6 rounded-3xl bg-white border-2 border-[#000b31]/10 flex items-center justify-center shadow-lg hover:shadow-2xl hover:border-[#f68c09]/50 hover:scale-110 transition-all duration-300 group"
              title={icon.name}
            >
              <Image
                src={icon.url}
                alt={icon.name}
                width={80}
                height={80}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain group-hover:brightness-0 group-hover:saturate-100 group-hover:sepia group-hover:saturate-5000% group-hover:hue-rotate-15deg transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
