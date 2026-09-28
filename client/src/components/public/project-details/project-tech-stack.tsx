import { Code2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TProject } from "@/types/portfolio";
import { ProjectBadge } from "./project-badge";

type TProjectTechStackProps = {
  project: TProject;
};

export function ProjectTechStack({ project }: TProjectTechStackProps) {
  if (!project.techStack.length) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Technologies used in this project."
          description="A clear technical stack overview for recruiters, clients, and engineering reviewers."
        />

        <Card className="mt-10 p-6 md:p-8">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
              <Code2 size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-highlight">
                Project Technology Stack
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <ProjectBadge key={tech}>{tech}</ProjectBadge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}