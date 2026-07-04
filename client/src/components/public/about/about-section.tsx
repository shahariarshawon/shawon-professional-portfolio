import { MapPin, Target, UserRound } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TAboutSection } from "@/types/portfolio";

type TAboutSectionProps = {
  about: TAboutSection | null;
};

export function AboutSection({ about }: TAboutSectionProps) {
  return (
    <section id="about" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="About Me"
          title="Backend-focused developer building practical software."
          description="I enjoy designing clean backend architecture, secure APIs, authentication systems, and database-driven applications."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5 leading-8 text-normal">
            <p>
              {about?.currentStatus ||
                "I am a backend-focused developer from Bangladesh with hands-on experience building RESTful APIs, authentication systems, and database-driven applications."}
            </p>

            <p>
              {about?.programmingJourney ||
                "My programming journey started with problem solving and gradually moved toward building real-world web applications."}
            </p>

            <p>
              {about?.workEnjoyment ||
                "I enjoy designing clean backend architectures, working with databases, building secure authentication systems, and connecting frontend applications with powerful APIs."}
            </p>

            <p>
              {about?.backendInterest ||
                "Currently, I am improving my skills in production-level backend development, including Node.js, Express.js, TypeScript, PostgreSQL, backend architecture, and scalable system design."}
            </p>

            <p>
              {about?.futurePlan ||
                "My future goal is to become a strong backend/software engineer who can design scalable systems, write clean code, work with cloud-based infrastructure, and contribute to professional engineering teams globally."}
            </p>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                <UserRound size={22} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-highlight">
                  Quick Facts
                </h3>
                <p className="text-sm text-normal">
                  Recruiter-friendly overview
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {(about?.quickFacts || []).map((fact) => (
                <div
                  key={fact.id}
                  className="rounded-2xl border border-site bg-(--color-background)/40 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-highlight">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-site p-4">
                <MapPin className="text-accent" size={20} />
                <p className="mt-3 text-sm font-medium text-highlight">
                  Bangladesh
                </p>
              </div>

              <div className="rounded-2xl border border-site p-4">
                <Target className="text-accent" size={20} />
                <p className="mt-3 text-sm font-medium text-highlight">
                  Backend Roles
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}