"use client";

import { ArrowRight, Download, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SocialLink } from "@/components/ui/social-link";
import { ImageWrapper } from "@/components/ui/image-wrapper";
import { cn } from "@/lib/utils";
import { THeroSection } from "@/types/portfolio";

type THeroSectionProps = {
  hero: THeroSection | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HeroSection({ hero }: THeroSectionProps) {
  const name = hero?.name || "Al Shahariar Arafat Shawon";
  const designation =
    hero?.designation || "Backend Developer | SaaS & AI Systems Engineer";
  const introduction =
    hero?.introduction ||
    "Building scalable SaaS platforms, production-grade APIs, and AI-powered backend systems using modern technologies.";

  return (
    <section id="home" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Background Ornaments */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform">
        <div className="h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/20 to-transparent opacity-50 blur-3xl mix-blend-screen" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Side: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-3">
              <Badge variant="accent" className="px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Available for Remote Backend Opportunities
              </Badge>
              {(hero?.badges || []).map((badge) => (
                <Badge key={badge.id} variant="outline" className="px-4 py-1.5">
                  {badge.text}
                </Badge>
              ))}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-4xl font-extrabold tracking-tight text-highlight sm:text-5xl lg:text-6xl lg:leading-[1.1]"
            >
              {name}
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="mb-6 text-xl font-medium text-[var(--color-accent)] sm:text-2xl"
            >
              {designation}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mb-10 max-w-2xl text-lg leading-relaxed text-normal sm:text-xl"
            >
              {introduction}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <a
                href="#projects"
                className={cn(buttonVariants({ size: "lg", variant: "primary" }), "gap-2 shadow-lg hover:shadow-xl transition-all")}
              >
                View Projects
                <ArrowRight size={18} />
              </a>

              {hero?.isGetInTouchEnabled && (
                <a
                  href="#contact"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2")}
                >
                  Contact Me
                </a>
              )}

              {hero?.isDownloadResumeEnabled && hero?.resumeUrl && (
                <a
                  href={hero.resumeUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "gap-2")}
                >
                  Download Resume
                  <Download size={18} />
                </a>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-sm font-semibold tracking-wider text-normal uppercase">
                Connect with me
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {(hero?.socialLinks || []).map((link) => (
                  <SocialLink key={link.id} platform={link.platform} href={link.url} target="_blank" rel="noreferrer" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mx-auto flex w-full max-w-md items-center justify-center lg:ml-auto lg:mr-0"
          >
            <div className="relative aspect-square w-full max-w-[400px]">
              {/* Decorative elements behind the image */}
              <div className="absolute -inset-4 rounded-full border border-[var(--color-accent)]/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-8 rounded-full border border-site/50 animate-[spin_15s_linear_infinite_reverse]" />
              
              <ImageWrapper
                src={hero?.photoUrl}
                alt={name}
                className="h-full w-full"
              />

              {/* Floating tech highlights */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-site bg-card/80 p-4 shadow-xl backdrop-blur-md">
                <p className="text-sm font-bold text-highlight">Backend Focus</p>
                <div className="mt-2 flex flex-wrap gap-2 max-w-[200px]">
                  {(hero?.techHighlights || []).map((tech) => (
                    <span
                      key={tech.id}
                      className="rounded bg-site px-2 py-1 text-xs font-medium text-normal"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {(hero?.techHighlights?.length === 0) && (
                    <>
                      <span className="rounded bg-site px-2 py-1 text-xs font-medium text-normal">Node.js</span>
                      <span className="rounded bg-site px-2 py-1 text-xs font-medium text-normal">PostgreSQL</span>
                      <span className="rounded bg-site px-2 py-1 text-xs font-medium text-normal">AWS</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
