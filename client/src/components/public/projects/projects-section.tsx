import { ArrowUpRight, ExternalLink, FolderGit2 } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { ImageReveal } from "@/components/motion/image-reveal";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { ProjectCover } from "@/components/public/projects/project-cover";
import { SectionEmpty } from "@/components/shared/section-empty";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { TProject } from "@/types/portfolio";

type TProjectsSectionProps = {
  projects: TProject[];
};

const IMPORTANT_PROJECTS = ["dokanos", "suresale"];

export function ProjectsSection({ projects }: TProjectsSectionProps) {
  // Keep DokanOS and SureSale pinned first (existing behaviour).
  const sortedProjects = [...projects].sort((a, b) => {
    const aIsImportant = IMPORTANT_PROJECTS.includes(a.name.toLowerCase());
    const bIsImportant = IMPORTANT_PROJECTS.includes(b.name.toLowerCase());
    if (aIsImportant && !bIsImportant) return -1;
    if (!aIsImportant && bIsImportant) return 1;
    return 0;
  });

  return (
    <Section id="projects" tone="surface">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title="Production-grade systems,"
          highlight="end to end."
          description="Scalable APIs, secure authentication, thoughtful data models and complete product flows — each with a full case study."
        />
        {sortedProjects.length ? (
          <p className="font-mono text-xs text-muted lg:pb-2">
            {String(sortedProjects.length).padStart(2, "0")} projects
          </p>
        ) : null}
      </div>

      {sortedProjects.length ? (
        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8" stagger={0.1}>
          {sortedProjects.map((project, index) => (
            <RevealItem key={project.id} className={cn("h-full min-w-0", index === 0 && "md:col-span-2")}>
              <ProjectCard
                project={project}
                index={index}
                total={sortedProjects.length}
                featured={index === 0}
                highlighted={IMPORTANT_PROJECTS.includes(project.name.toLowerCase())}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      ) : (
        <SectionEmpty
          className="mt-14"
          icon={FolderGit2}
          title="No projects published"
          description="There are no public case studies to show at the moment. If you'd like examples of my work, reach out and I'll share relevant projects."
          action={{ label: "Request examples", href: "#contact" }}
        />
      )}
    </Section>
  );
}

type TProjectCardProps = {
  project: TProject;
  index: number;
  total: number;
  featured: boolean;
  highlighted: boolean;
};

function ProjectCard({ project, index, total, featured, highlighted }: TProjectCardProps) {
  const image = project.images?.[0];
  const caseStudyHref = `/projects/${project.slug}`;

  return (
    <Tilt max={featured ? 2.5 : 4} className="h-full rounded-[1.75rem]">
      <article
        className={cn(
          "group glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] shadow-soft transition-[border-color,box-shadow] duration-500 ease-out-expo hover:border-line-strong hover:shadow-lift",
          featured && "lg:grid lg:grid-cols-[1.15fr_1fr]",
          highlighted && "border-gradient"
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden border-b border-line",
            featured && "lg:aspect-auto lg:min-h-[440px] lg:border-b-0 lg:border-r"
          )}
        >
          {image?.url ? (
            <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
              <ImageReveal
                src={image.url}
                alt={image.altText || project.name}
                maxWidth={featured ? 1100 : 800}
                fallback={<ProjectCover name={project.name} techStack={project.techStack} seed={index} />}
                className="h-full w-full"
              />
            </div>
          ) : (
            <ProjectCover name={project.name} techStack={project.techStack} seed={index} />
          )}

          <div className="absolute left-4 top-4 flex gap-2">
            {highlighted ? (
              <Badge variant="glass">Top project</Badge>
            ) : project.isFeatured ? (
              <Badge variant="glass">Featured</Badge>
            ) : null}
          </div>
          <span className="glass absolute right-4 top-4 rounded-full px-2.5 py-1 font-mono text-[11px] text-muted">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Content */}
        <div className={cn("flex flex-1 flex-col p-6 sm:p-8", featured && "lg:justify-center lg:p-10")}>
          {project.techStack.length ? (
            <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {project.techStack.slice(0, featured ? 6 : 4).map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
              {project.techStack.length > (featured ? 6 : 4) ? (
                <li>+{project.techStack.length - (featured ? 6 : 4)}</li>
              ) : null}
            </ul>
          ) : null}

          <h3 className={cn("mt-4 text-fg", featured ? "text-h2" : "text-h3")}>
            {/* Stretched link: the whole card opens the case study. */}
            <Link href={caseStudyHref} className="after:absolute after:inset-0 after:z-0">
              {project.name}
            </Link>
          </h3>

          <p className={cn("mt-4 flex-1 text-sm leading-7 text-muted", featured ? "lg:text-base lg:leading-8" : "line-clamp-3")}>
            {project.shortDescription}
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-fg">
              Read case study
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-[background-color,border-color,color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-brand group-hover:text-on-brand">
                <ArrowUpRight size={15} />
              </span>
            </span>

            <div className="relative z-10 flex gap-2">
              {project.githubLink ? (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name} source on GitHub`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-glass hover:text-fg"
                >
                  <FaGithub size={18} />
                </a>
              ) : null}
              {project.liveLink ? (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name} live site`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-glass hover:text-brand-bright"
                >
                  <ExternalLink size={17} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
