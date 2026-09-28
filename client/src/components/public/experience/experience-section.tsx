import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TExperience } from "@/types/portfolio";

type TExperienceSectionProps = {
  experiences: TExperience[];
};

export function ExperienceSection({ experiences }: TExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Experience"
          title="Professional backend development experience."
          description="A clear overview of internships, responsibilities, achievements, backend tasks, and production-level learning."
        />

        <div className="mt-12 space-y-6">
          {experiences.length ? (
            experiences.map((experience) => (
              <Card key={experience.id} className="p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-(--color-accent)/10 text-accent">
                      {experience.companyLogo ? (
                        <img
                          src={experience.companyLogo}
                          alt={`${experience.companyName} logo`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BriefcaseBusiness size={24} />
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-highlight">
                        {experience.role}
                      </h3>

                      <p className="mt-1 font-medium text-accent">
                        {experience.companyName}
                      </p>

                      <p className="mt-2 text-sm text-normal">
                        {experience.startDate} –{" "}
                        {experience.endDate || "Present"} •{" "}
                        {experience.location || "Bangladesh"}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-(--color-accent)/30 bg-(--color-accent)/10 px-4 py-2 text-xs font-semibold text-accent">
                    {experience.status === "CURRENTLY_WORKING"
                      ? "Currently Working"
                      : "Completed"}
                  </span>
                </div>

                {experience.description ? (
                  <p className="mt-6 leading-8 text-normal">
                    {experience.description}
                  </p>
                ) : null}

                {experience.bullets.length ? (
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {experience.bullets.map((bullet) => (
                      <div key={bullet.id} className="flex gap-3">
                        <CheckCircle2
                          className="mt-1 shrink-0 text-accent"
                          size={18}
                        />

                        <p className="text-sm leading-7 text-normal">
                          {bullet.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {experience.metrics.length ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {experience.metrics.map((metric) => (
                      <div
                        key={metric.id}
                        className="rounded-2xl border border-site bg-(--color-background)/40 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-normal">
                          {metric.label}
                        </p>

                        <p className="mt-2 text-lg font-bold text-highlight">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-highlight">No experience added yet.</p>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
