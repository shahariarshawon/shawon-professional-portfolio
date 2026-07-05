import { ArrowDown, Download, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { THeroSection } from "@/types/portfolio";
import { FaGithub, FaLinkedin } from "react-icons/fa";

type THeroSectionProps = {
  hero: THeroSection | null;
};

const getSocialIcon = (platform: string) => {
  const normalized = platform.toLowerCase();

  if (normalized.includes("github")) {
    return <FaGithub size={18} />;
  }

  if (normalized.includes("linkedin")) {
    return <FaLinkedin size={18} />;
  }

  return <ExternalLink size={18} />;
};

export function HeroSection({ hero }: THeroSectionProps) {
  const name = hero?.name || "AL Shahariar Arafat Shawon";

  const designation =
    hero?.designation ||
    "Backend Developer | Backend-Focused Full-Stack Developer | Software Engineer";

  const introduction =
    hero?.introduction ||
    "I build secure, scalable, and database-driven web applications using Node.js, Express.js, TypeScript, Next.js, and modern backend technologies.";

  return (
    <section id="home" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-(--color-accent)/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-(--color-accent)/10 blur-3xl" />

      <div className="container-custom relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex flex-wrap gap-3">
            {(hero?.badges || []).map((badge) => (
              <span
                key={badge.id}
                className="rounded-full border border-(--color-accent)/30 bg-(--color-accent)/10 px-4 py-2 text-xs font-medium text-accent"
              >
                {badge.text}
              </span>
            ))}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Backend Developer Portfolio
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight tracking-tight text-highlight md:text-6xl">
            {name}
          </h1>

          <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-highlight">
            {designation}
          </p>

          <p className="mt-6 max-w-3xl text-base leading-8 text-normal md:text-lg">
            {introduction}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            {hero?.isGetInTouchEnabled ? (
              <a href="#contact" className={cn(buttonVariants({ size: "lg" }))}>
                Get in Touch
                <ArrowDown className="ml-2" size={18} />
              </a>
            ) : null}

            {hero?.isViewResumeEnabled && hero?.resumeUrl ? (
              <a
                href={hero.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                View Resume
                <ExternalLink className="ml-2" size={18} />
              </a>
            ) : null}

            {hero?.isDownloadResumeEnabled && hero?.resumeUrl ? (
              <a
                href={hero.resumeUrl}
                download
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                Download Resume
                <Download className="ml-2" size={18} />
              </a>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {(hero?.socialLinks || []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-site bg-card text-highlight transition hover:border-(--color-accent) hover:text-accent"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {(hero?.techHighlights || []).map((tech) => (
              <span
                key={tech.id}
                className="rounded-full border border-site bg-card px-4 py-2 text-sm font-medium text-highlight"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <Card className="relative mx-auto w-full max-w-md overflow-hidden p-5">
          <div className="aspect-4/5 overflow-hidden rounded-3xl border border-site bg-(--color-accent)/10">
            {hero?.photoUrl ? (
              <img
                src={hero.photoUrl}
                alt={name}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-(--color-accent)/20 text-3xl font-bold text-accent">
                    AS
                  </div>

                  <p className="mt-6 text-lg font-semibold text-highlight">
                    Professional Photo Placeholder
                  </p>

                  <p className="mt-2 text-sm text-normal">
                    Upload your profile photo from the admin dashboard later.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-site bg-(--color-background)/80 p-4 backdrop-blur-xl">
            <p className="text-sm font-semibold text-highlight">
              Backend-Focused Developer
            </p>

            <p className="mt-1 text-xs text-normal">
              REST APIs • Authentication • Database Design
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
