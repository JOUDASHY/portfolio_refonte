"use client";

import { useEffect, useRef } from "react";

export default function Particles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const getColor = () => {
      const styles = getComputedStyle(document.documentElement);
      const jaune = styles.getPropertyValue("--jaune").trim();
      const accent = styles.getPropertyValue("--color-accent").trim();
      return jaune || accent || "#f68c09";
    };

    const hexOrCssWithAlpha = (color: string, alpha: number) => {
      const hexMatch = color.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
      if (hexMatch) {
        const r = parseInt(hexMatch[1], 16);
        const g = parseInt(hexMatch[2], 16);
        const b = parseInt(hexMatch[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return color;
    };

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const initParticles = () => {
      const count = Math.min(100, Math.floor((canvas.clientWidth * canvas.clientHeight) / 12000));
      particlesRef.current = Array.from({ length: count }).map(() => ({
        x: rand(0, canvas.clientWidth),
        y: rand(0, canvas.clientHeight),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        r: rand(1, 2.2),
      }));
    };
    initParticles();

    const loop = () => {
      const color = getColor();
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const parts = particlesRef.current;

      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.clientWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.clientHeight) p.vy *= -1;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i];
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 140 * 140) {
            const alpha = 1 - Math.sqrt(dist2) / 140;
            ctx.strokeStyle = hexOrCssWithAlpha(color, alpha * 0.35);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = hexOrCssWithAlpha(color, 0.85);
      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
      aria-hidden
    />
  );
}


