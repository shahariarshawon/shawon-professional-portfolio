"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { GradientMesh } from "@/components/effects/gradient-mesh";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { TextReveal } from "@/components/motion/text-reveal";
import { Tilt } from "@/components/motion/tilt";
import { RoleRotator } from "@/components/public/hero/role-rotator";
import { buttonVariants } from "@/components/ui/button";
import { SocialLink } from "@/components/ui/social-link";
import { siteConfig } from "@/constants/site";
import { useFinePointer } from "@/hooks/use-fine-pointer";
import { useIntroComplete } from "@/hooks/use-intro-complete";
import { ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { THeroSection } from "@/types/portfolio";

type THeroSectionProps = {
  hero: THeroSection | null;
};

const FALLBACK_STACK = ["TypeScript", "Node.js", "PostgreSQL", "Docker"];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out } }
};

/** Pointer-parallax offset for a layer at the given depth (px at the edge). */
function useDepth(value: MotionValue<number>, depth: number) {
  return useTransform(value, [-0.5, 0.5], [-depth, depth]);
}

export function HeroSection({ hero }: THeroSectionProps) {
  const introDone = useIntroComplete();
  const isFinePointer = useFinePointer();

  const name = hero?.name || siteConfig.name;
  const designation = hero?.designation || "Backend Developer & Software Engineer";
  const introduction =
    hero?.introduction ||
    "I design and build scalable backends, production-grade APIs and AI-powered products — from database schema to cloud deployment.";
  const status = hero?.availabilityStatus || hero?.badges?.[0]?.text || "Available for new opportunities";
  const secondaryBadge = hero?.badges?.[1]?.text;
  const stack = hero?.techHighlights?.length
    ? hero.techHighlights.map((tech) => tech.name)
    : FALLBACK_STACK;
  const resumeHref =
    hero?.resumeUrl && (hero.isViewResumeEnabled || hero.isDownloadResumeEnabled)
      ? hero.resumeUrl
      : null;
  const showContactCta = hero?.isGetInTouchEnabled ?? true;

  /* Pointer tracking — motion values only, no React re-renders. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spotX = useMotionValue(-1000);
  const spotY = useMotionValue(-1000);
  const smoothX = useSpring(pointerX, spring.pointer);
  const smoothY = useSpring(pointerY, spring.pointer);

  const meshX = useDepth(smoothX, -28);
  const meshY = useDepth(smoothY, -28);
  const nearX = useDepth(smoothX, 22);
  const nearY = useDepth(smoothY, 22);
  const farX = useDepth(smoothX, 12);
  const farY = useDepth(smoothY, 12);

  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--color-accent-bright) 10%, transparent), transparent 70%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!isFinePointer) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    spotX.set(x);
    spotY.set(y);
    pointerX.set(x / rect.width - 0.5);
    pointerY.set(y / rect.height - 0.5);
  };

  const state = introDone ? "visible" : "hidden";

  return (
    <section
      id="home"
      onPointerMove={handlePointerMove}
      className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32 lg:pb-28 lg:pt-36"
    >
      {/* ---------- Background ---------- */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[5%] -z-20"
        style={isFinePointer ? { x: meshX, y: meshY } : undefined}
      >
        <GradientMesh />
      </motion.div>
      <div aria-hidden="true" className="bg-grid mask-fade-radial absolute inset-0 -z-10" />
      {isFinePointer ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: spotlight }}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-(--color-background)"
      />

      {/* Floating tech chips (desktop only) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden xl:block"
        style={isFinePointer ? { x: farX, y: farY } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0, transition: { duration: 1.2, delay: 0.9 } }}
      >
        {stack.slice(0, CHIP_POSITIONS.length).map((tech, index) => (
          <span
            key={tech}
            className="glass absolute animate-float rounded-full px-3.5 py-1.5 font-mono text-[11px] text-muted"
            style={{
              ...CHIP_POSITIONS[index % CHIP_POSITIONS.length],
              animationDelay: `${index * -1.6}s`
            }}
          >
            {tech}
          </span>
        ))}
      </motion.div>

      {/* ---------- Content ---------- */}
      <div className="container-custom grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={state}
          className="flex flex-col items-start lg:col-span-7"
        >
          <motion.div
            variants={item}
            data-reveal=""
            className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-xs font-medium text-fg sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-brand-bright" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
            </span>
            {status}
          </motion.div>

          <h1 className="mt-7 text-display text-balance text-fg">
            <TextReveal text={name} play={introDone} delay={0.45} stagger={0.08} highlightLast={1} />
          </h1>

          <motion.p
            variants={item}
            data-reveal=""
            className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-h3 text-fg"
          >
            <span className="font-mono text-base font-normal text-brand">~/</span>
            <RoleRotator roles={siteConfig.heroRoles} play={introDone} />
          </motion.p>

          <motion.p variants={item} data-reveal="" className="mt-6 max-w-xl text-lead text-pretty text-muted">
            {introduction}
          </motion.p>

          <motion.div variants={item} data-reveal="" className="mt-10 flex w-full flex-wrap items-center gap-3 sm:gap-4">
            <Magnetic>
              <a href="#projects" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "group")}>
                View my work
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>

            {showContactCta ? (
              <Magnetic>
                <a href="#contact" className={buttonVariants({ variant: "glass", size: "xl" })}>
                  Let&apos;s talk
                </a>
              </Magnetic>
            ) : null}

            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "link" }), "group ml-1 gap-1.5 text-sm")}
              >
                Résumé
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </motion.div>

          {hero?.socialLinks?.length ? (
            <motion.div variants={item} data-reveal="" className="mt-12 flex items-center gap-4">
              <span className="text-eyebrow text-muted">Find me</span>
              <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
              <div className="flex flex-wrap gap-2.5">
                {hero.socialLinks.map((link) => (
                  <SocialLink
                    key={link.id}
                    platform={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </motion.div>

        {/* ---------- Portrait ---------- */}
        <motion.div
          className="relative mx-auto w-full max-w-[360px] sm:max-w-[400px] lg:col-span-5 lg:mr-0"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={introDone ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 1.1, ease: ease.out, delay: 0.55 }}
          data-reveal=""
        >
          {/* Orbit */}
          <div aria-hidden="true" className="absolute -inset-8 -z-10 hidden animate-spin-slow rounded-full border border-dashed border-line sm:block">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-bright shadow-[0_0_16px_var(--color-accent-bright)]" />
          </div>
          <div aria-hidden="true" className="absolute inset-6 -z-10 rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_65%)]" />

          <Tilt className="rounded-[2rem]">
            <div className="glass border-gradient relative rounded-[2rem] p-2 shadow-lift">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-surface">
                {hero?.photoUrl ? (
                  <ImageReveal
                    src={hero.photoUrl}
                    alt={`${name}, ${designation}`}
                    immediate
                    play={introDone}
                    delay={0.6}
                    loading="eager"
                    className="h-full w-full"
                    imgClassName="object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--glow-1),transparent_60%),radial-gradient(circle_at_80%_80%,var(--glow-2),transparent_60%)]">
                    <span className="font-display text-7xl font-semibold text-gradient">
                      {getInitials(name)}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </Tilt>

          {/* Floating code card */}
          <motion.div
            className="absolute -bottom-8 -left-3 z-20 w-[min(15rem,70%)] sm:-left-10"
            style={isFinePointer ? { x: nearX, y: nearY } : undefined}
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: ease.out, delay: 1.05 }}
          >
            <div className="glass-strong animate-float rounded-2xl p-4 shadow-lift">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-[10px] text-muted">stack.ts</span>
              </div>
              <pre className="overflow-hidden font-mono text-[11px] leading-5">
                <code>
                  <span className="text-brand-2">const</span> <span className="text-fg">stack</span>{" "}
                  <span className="text-muted">=</span> <span className="text-muted">[</span>
                  {"\n"}
                  {stack.slice(0, 5).map((tech) => (
                    <span key={tech}>
                      {"  "}
                      <span className="text-brand-bright">&quot;{tech}&quot;</span>
                      <span className="text-muted">,</span>
                      {"\n"}
                    </span>
                  ))}
                  <span className="text-muted">];</span>
                </code>
              </pre>
            </div>
          </motion.div>

          {/* Floating status card */}
          {secondaryBadge ? (
            <motion.div
              className="absolute -right-2 top-8 z-20 max-w-[12rem] sm:-right-8"
              style={isFinePointer ? { x: farX, y: farY } : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={introDone ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, ease: ease.out, delay: 1.2 }}
            >
              <div className="glass-strong animate-float rounded-2xl px-4 py-3 shadow-lift [animation-delay:-3s]">
                <p className="text-eyebrow text-brand">Status</p>
                <p className="mt-1.5 text-xs font-medium leading-5 text-fg">{secondaryBadge}</p>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted transition-colors hover:text-fg lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0, transition: { delay: 1.6, duration: 0.8 } }}
      >
        <span className="text-eyebrow">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line-strong">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-brand-bright"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}

// Chips sit in the empty gutters between the copy and the portrait.
const CHIP_POSITIONS: React.CSSProperties[] = [
  { left: "44%", top: "14%" },
  { left: "53%", bottom: "14%" }
];

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}
