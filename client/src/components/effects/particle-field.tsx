"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type TParticleFieldProps = {
  className?: string;
  /** Particles per 10,000px² of canvas, capped for large screens. */
  density?: number;
  /** Max distance (px) at which two particles are linked. */
  linkDistance?: number;
};

type TParticle = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Lightweight constellation on a single canvas. Capped particle count, DPR
 * capped at 2, pauses when the tab is hidden, and renders a single static
 * frame under reduced motion.
 */
export function ParticleField({ className, density = 0.6, linkDistance = 120 }: TParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const dotColor = styles.getPropertyValue("--color-accent-bright").trim() || "#5eead4";
    const linkColor = styles.getPropertyValue("--color-accent-2").trim() || "#818cf8";

    let width = 0;
    let height = 0;
    let particles: TParticle[] = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round(((width * height) / 10000) * density), 70);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkDistance) {
            ctx.globalAlpha = (1 - dist / linkDistance) * 0.22;
            ctx.strokeStyle = linkColor;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      draw();
      frame = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(step);
    };

    resize();

    if (reduceMotion) {
      draw();
    } else {
      frame = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [density, linkDistance]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("h-full w-full", className)} />;
}
