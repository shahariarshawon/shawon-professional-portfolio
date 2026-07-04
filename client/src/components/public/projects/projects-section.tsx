import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TProject } from "@/types/portfolio";
import { FaGithub } from "react-icons/fa";

type TProjectsSectionProps = {
  projects: TProject[];
};

export function ProjectsSection({ projects }: TProjectsSectionProps) {
  return (
    <section id="projects" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Projects"
          title="Backend-focused projects with real application flow."
          description="Each project highlights API integration, authentication, database design, role-based access, and practical software engineering skills."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const image = project.images?.[0];

            return (
              <Card key={project.id} className="overflow-hidden">
                <div className="aspect-video border-b border-site bg-(--color-accent)/10">
                  {image?.url ? (
                    <img
                      src={image.url}
                      alt={image.altText || project.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center">
                      <p className="font-semibold text-highlight">
                        Project Image Placeholder
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {project.isFeatured ? (
                    <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-accent">
                      Featured
                    </span>
                  ) : null}

                  <h3 className="mt-4 text-xl font-bold text-highlight">
                    {project.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-normal">
                    {project.shortDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-site px-3 py-1 text-xs font-medium text-highlight"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      View Details
                      <ArrowUpRight className="ml-2" size={16} />
                    </Link>

                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                        )}
                      >
                        <FaGithub className="mr-2" size={16} />
                        GitHub
                      </a>
                    ) : null}

                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                        )}
                      >
                        Live
                      </a>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
