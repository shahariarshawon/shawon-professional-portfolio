"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Section } from "@/components/ui/section";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TCertification, TEducation } from "@/types/portfolio";

type TEducationCertificationsSectionProps = {
  education: TEducation[];
  certifications: TCertification[];
};

type TTab = "education" | "certifications";

const panel = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } }
};

export function EducationCertificationsSection({
  education,
  certifications
}: TEducationCertificationsSectionProps) {
  const [activeTab, setActiveTab] = useState<TTab>("education");

  const tabs: { id: TTab; label: string; count: number }[] = [
    { id: "education", label: "Education", count: education.length },
    { id: "certifications", label: "Certifications", count: certifications.length }
  ];

  return (
    <Section id="education">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="05"
          eyebrow="Education"
          title="Foundations &"
          highlight="credentials."
          description="Formal education and professional learning that shaped how I build."
        />

        <Reveal y={12}>
          <div role="tablist" aria-label="Education and certifications" className="glass inline-flex rounded-full p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-on-brand" : "text-muted hover:text-fg"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="education-tab"
                      className="bg-gradient-brand absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">
                    {tab.label}
                    <span className="ml-2 font-mono text-[11px] opacity-70">{tab.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <div className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "education" ? (
            <motion.div
              key="education"
              id="panel-education"
              role="tabpanel"
              aria-labelledby="tab-education"
              {...panel}
              className="grid gap-5"
            >
              {education.length ? (
                education.map((item) => (
                  <Card key={item.id} variant="glass" interactive className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <IconTile size="lg">
                        <GraduationCap size={24} />
                      </IconTile>

                      <div className="flex-1">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-h3 text-fg">{item.degree}</h3>
                            <p className="mt-1 font-medium text-brand">{item.institution}</p>
                          </div>
                          <p className="font-mono text-xs text-muted md:pt-2">
                            {item.duration}
                            {item.location ? ` · ${item.location}` : ""}
                          </p>
                        </div>
                        {item.description ? (
                          <p className="mt-5 max-w-3xl leading-8 text-muted">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <SectionEmpty
                  icon={GraduationCap}
                  title="No education listed"
                  description="Formal education details aren't published on this page. Feel free to ask and I'll share them."
                  action={{ label: "Get in touch", href: "#contact" }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="certifications"
              id="panel-certifications"
              role="tabpanel"
              aria-labelledby="tab-certifications"
              {...panel}
              className="grid gap-5 md:grid-cols-2"
            >
              {certifications.length ? (
                certifications.map((item) => {
                  const link = item.credentialLink || item.credentialUrl;

                  return (
                    <Card key={item.id} variant="glass" interactive className="flex flex-col p-6 sm:p-7">
                      <div className="flex items-start gap-4">
                        <IconTile>
                          <Award size={20} />
                        </IconTile>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold leading-snug text-fg">{item.title || item.name}</h3>
                          <p className="mt-1 text-sm font-medium text-brand">
                            {item.issuingOrganization || item.issuer}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                        <p className="font-mono text-xs text-muted">
                          {item.issueDate ? `Issued ${item.issueDate}` : "Certified"}
                        </p>
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-fg transition-colors hover:text-brand-bright"
                          >
                            View credential
                            <ArrowUpRight size={15} />
                          </a>
                        ) : null}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="md:col-span-2">
                  <SectionEmpty
                    icon={Award}
                    title="No certifications listed"
                    description="There are no certifications to display right now. My project work is the best record of what I can do."
                    action={{ label: "View projects", href: "#projects" }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
