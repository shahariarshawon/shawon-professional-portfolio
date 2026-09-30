"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Section } from "@/components/ui/section";
import { TExperience } from "@/types/portfolio";

type TExperienceSectionProps = {
  experiences: TExperience[];
};

export function ExperienceSection({ experiences }: TExperienceSectionProps) {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"]
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="experience" tone="surface">
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title="Where I've been"
        highlight="shipping."
        description="Roles, responsibilities and measurable outcomes from real production work."
      />

      {experiences.length ? (
        <ol ref={timelineRef} className="relative mt-14 space-y-8 pl-8 sm:pl-12 lg:mt-16">
          {/* Rail + scroll-linked progress */}
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line sm:left-[11px]" />
          <motion.span
            aria-hidden="true"
            className="bg-gradient-brand absolute bottom-2 left-[7px] top-2 w-px origin-top sm:left-[11px]"
            style={{ scaleY: lineScale }}
          />

          {experiences.map((experience) => {
            const isCurrent = experience.status === "CURRENTLY_WORKING";

            return (
              <li key={experience.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-8 top-8 flex h-4 w-4 items-center justify-center rounded-full border border-line-strong bg-ink sm:-left-12 sm:h-6 sm:w-6"
                >
                  <span className={isCurrent ? "h-2 w-2 animate-pulse-dot rounded-full bg-brand-bright" : "h-1.5 w-1.5 rounded-full bg-muted"} />
                </span>

                <Reveal>
                  <Card variant="glass" interactive className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <IconTile size="lg" className="overflow-hidden">
                          {experience.companyLogo ? (
                            <img
                              src={experience.companyLogo}
                              alt={`${experience.companyName} logo`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <BriefcaseBusiness size={22} />
                          )}
                        </IconTile>

                        <div>
                          <h3 className="text-h3 text-fg">{experience.role}</h3>
                          <p className="mt-1 font-medium text-brand">{experience.companyName}</p>
                          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                            <span>
                              {experience.startDate} — {experience.endDate || "Present"}
                            </span>
                            {experience.location ? (
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} />
                                {experience.location}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>

                      <span
                        className={
                          isCurrent
                            ? "w-fit rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-brand"
                            : "w-fit rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
                        }
                      >
                        {isCurrent ? "Current" : "Completed"}
                      </span>
                    </div>

                    {experience.description ? (
                      <p className="mt-6 max-w-3xl leading-8 text-muted">{experience.description}</p>
                    ) : null}

                    {experience.bullets.length ? (
                      <ul className="mt-6 grid gap-x-8 gap-y-3 md:grid-cols-2">
                        {experience.bullets.map((bullet) => (
                          <li key={bullet.id} className="flex gap-3 text-sm leading-7 text-muted">
                            <span aria-hidden="true" className="mt-[0.7rem] h-1 w-3 shrink-0 rounded-full bg-gradient-brand" />
                            {bullet.text}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {experience.metrics.length ? (
                      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                        {experience.metrics.map((metric) => (
                          <div key={metric.id} className="flex flex-col-reverse rounded-2xl border border-line bg-glass p-4">
                            <dt className="mt-1 text-xs leading-5 text-muted">{metric.label}</dt>
                            <dd className="font-display text-2xl font-semibold tracking-tight text-gradient">
                              {metric.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </Card>
                </Reveal>
              </li>
            );
          })}
        </ol>
      ) : (
        <Card variant="glass" className="mt-14 p-10 text-center">
          <p className="text-fg">Experience details are on their way.</p>
        </Card>
      )}
    </Section>
  );
}
