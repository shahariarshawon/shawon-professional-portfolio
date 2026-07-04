"use client";

import { Award, GraduationCap } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TCertification, TEducation } from "@/types/portfolio";

type TEducationCertificationsSectionProps = {
  education: TEducation[];
  certifications: TCertification[];
};

export function EducationCertificationsSection({
  education,
  certifications
}: TEducationCertificationsSectionProps) {
  const [activeTab, setActiveTab] = useState<"education" | "certifications">(
    "education"
  );

  return (
    <section id="education" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Education"
          title="Academic background and certifications."
          description="A concise overview of formal education and professional learning achievements."
        />

        <div className="mt-10 flex w-fit rounded-full border border-site bg-card p-1">
          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition",
              activeTab === "education"
                ? "bg-(--color-accent) text-white"
                : "text-normal hover:text-highlight"
            )}
          >
            Education
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certifications")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition",
              activeTab === "certifications"
                ? "bg-(--color-accent) text-white"
                : "text-normal hover:text-highlight"
            )}
          >
            Certifications
          </button>
        </div>

        <div className="mt-8 grid gap-6">
          {activeTab === "education"
            ? education.map((item) => (
                <Card key={item.id} className="p-6 md:p-8">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                      <GraduationCap size={26} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-highlight">
                        {item.degree}
                      </h3>
                      <p className="mt-2 font-medium text-accent">
                        {item.institution}
                      </p>
                      <p className="mt-2 text-sm text-normal">
                        {item.duration} • {item.location}
                      </p>
                      {item.description ? (
                        <p className="mt-5 leading-8 text-normal">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))
            : certifications.length
              ? certifications.map((item) => (
                  <Card key={item.id} className="p-6 md:p-8">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                        <Award size={26} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-highlight">
                          {item.name}
                        </h3>
                        <p className="mt-2 font-medium text-accent">
                          {item.issuingOrganization}
                        </p>

                        {item.issueDate ? (
                          <p className="mt-2 text-sm text-normal">
                            Issued: {item.issueDate}
                          </p>
                        ) : null}

                        {item.credentialLink ? (
                          <a
                            href={item.credentialLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm font-semibold text-accent"
                          >
                            View Credential
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))
              : (
                <Card className="p-8 text-center">
                  <p className="text-highlight">
                    No certifications added yet.
                  </p>
                </Card>
              )}
        </div>
      </div>
    </section>
  );
}