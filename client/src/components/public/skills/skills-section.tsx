import { Code2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TSkillCategory } from "@/types/portfolio";

type TSkillsSectionProps = {
  skills: TSkillCategory[];
};

export function SkillsSection({ skills }: TSkillsSectionProps) {
  return (
    <section id="skills" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Skills"
          title="Backend-first technical skill set."
          description="My main focus is backend development, API design, authentication, database design, and scalable web application architecture."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {skills.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                  <Code2 size={21} />
                </div>

                <h3 className="text-xl font-bold text-highlight">
                  {category.name}
                </h3>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group rounded-full border border-site bg-(--color-background)/40 px-4 py-2 transition hover:border-(--color-accent)"
                  >
                    <span className="text-sm font-medium text-highlight group-hover:text-accent">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}