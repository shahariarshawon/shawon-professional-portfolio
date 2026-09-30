import {
  Brain,
  Cloud,
  Code2,
  Database,
  LayoutTemplate,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon
} from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { IconTile } from "@/components/ui/icon-tile";
import { Marquee } from "@/components/ui/marquee";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";
import { TSkillCategory } from "@/types/portfolio";

type TSkillsSectionProps = {
  skills: TSkillCategory[];
};

const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/back|server|api/i, Server],
  [/front|ui|web/i, LayoutTemplate],
  [/data|sql|db/i, Database],
  [/cloud|devops|infra|deploy/i, Cloud],
  [/ai|ml|machine|llm/i, Brain],
  [/sec|auth/i, ShieldCheck],
  [/tool/i, Wrench],
  [/lang/i, Code2]
];

const getCategoryIcon = (name: string) =>
  CATEGORY_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? Sparkles;

export function SkillsSection({ skills }: TSkillsSectionProps) {
  const categories = skills.filter((category) => category.skills.length);
  const allSkills = categories.flatMap((category) => category.skills.map((skill) => skill.name));
  const half = Math.ceil(allSkills.length / 2);

  return (
    <Section id="skills" contained={false}>
      <div className="container-custom">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          title="A backend-first"
          highlight="toolkit."
          description="The languages, frameworks and infrastructure I reach for to design, build and ship reliable systems."
        />
      </div>

      {allSkills.length > 6 ? (
        <div className="mt-14 space-y-3 lg:mt-16" aria-hidden="true">
          <Marquee duration={45}>
            {allSkills.slice(0, half).map((name, i) => (
              <SkillPill key={`${name}-${i}`} name={name} />
            ))}
          </Marquee>
          <Marquee duration={50} reverse>
            {allSkills.slice(half).map((name, i) => (
              <SkillPill key={`${name}-${i}`} name={name} />
            ))}
          </Marquee>
        </div>
      ) : null}

      <div className="container-custom">
        <RevealGroup className="mt-10 grid grid-flow-row-dense gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const isWide = category.skills.length >= 8;

            return (
              <RevealItem key={category.id} className={cn("h-full", isWide && "lg:col-span-2")}>
                <SpotlightCard className="h-full p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <IconTile>
                        <Icon size={20} />
                      </IconTile>
                      <h3 className="text-h3 text-fg">{category.name}</h3>
                    </div>
                    <span className="font-mono text-xs text-muted">
                      {String(category.skills.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="mt-7 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className="group/skill inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3.5 py-1.5 text-sm text-fg transition-colors duration-300 hover:border-[var(--color-accent-bright)]/50"
                      >
                        {skill.iconUrl ? (
                          <img src={skill.iconUrl} alt="" loading="lazy" className="h-4 w-4 object-contain" />
                        ) : null}
                        {skill.name}
                        {typeof skill.level === "number" ? (
                          <span className="sr-only">, proficiency {skill.level} out of 100</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

function SkillPill({ name }: { name: string }) {
  return (
    <span className="mx-1.5 inline-flex items-center gap-3 rounded-full border border-line bg-glass px-5 py-2.5 font-display text-lg font-medium tracking-tight text-fg/80 sm:text-xl">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
      {name}
    </span>
  );
}
