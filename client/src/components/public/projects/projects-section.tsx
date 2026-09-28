"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TProject } from "@/types/portfolio";

type TProjectsSectionProps = {
  projects: TProject[];
};

const IMPORTANT_PROJECTS = ["dokanos", "suresale"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProjectsSection({ projects }: TProjectsSectionProps) {
  // Sort projects so DokanOS and SureSale appear first
  const sortedProjects = [...projects].sort((a, b) => {
    const aIsImportant = IMPORTANT_PROJECTS.includes(a.name.toLowerCase());
    const bIsImportant = IMPORTANT_PROJECTS.includes(b.name.toLowerCase());
    if (aIsImportant && !bIsImportant) return -1;
    if (!aIsImportant && bIsImportant) return 1;
    return 0;
  });

  return (
    <section id="projects" className="section-padding border-t border-site bg-site/50">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Featured Work"
          title="Production-Grade Backend Systems."
          description="Highlighting scalable APIs, secure authentication, database architecture, and complete application flows."
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {sortedProjects.map((project) => {
            const image = project.images?.[0];
            const isHighlighted = IMPORTANT_PROJECTS.includes(project.name.toLowerCase());

            return (
              <motion.div key={project.id} variants={cardVariants} className="group h-full">
                <Card className={cn(
                  "flex h-full flex-col overflow-hidden transition-all duration-300",
                  "hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 hover:-translate-y-2 border-site bg-card",
                  isHighlighted ? "border-[var(--color-accent)]/50 ring-1 ring-[var(--color-accent)]/20" : ""
                )}>
                  {/* Image Section */}
                  <div className="relative aspect-video overflow-hidden border-b border-site bg-[var(--color-accent)]/5">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.altText || project.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-6 text-center">
                        <p className="font-semibold text-highlight opacity-50">
                          {project.name}
                        </p>
                      </div>
                    )}
                    
                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {isHighlighted && (
                        <Badge variant="accent" className="shadow-sm backdrop-blur-md">
                          Top Project
                        </Badge>
                      )}
                      {project.isFeatured && !isHighlighted && (
                        <Badge variant="default" className="shadow-sm backdrop-blur-md">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-6 lg:p-8">
                    <h3 className="text-2xl font-bold tracking-tight text-highlight transition-colors group-hover:text-[var(--color-accent)]">
                      {project.name}
                    </h3>
                    
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-normal flex-1">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-site px-2.5 py-1 text-xs font-medium text-normal border border-site transition-colors group-hover:border-[var(--color-accent)]/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="rounded-md bg-site px-2.5 py-1 text-xs font-medium text-normal border border-site">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-site pt-6">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-highlight"
                      >
                        Read Case Study
                        <ArrowUpRight className="ml-1" size={16} />
                      </Link>

                      <div className="flex gap-3">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View Source on GitHub"
                            className="text-normal transition-colors hover:text-highlight"
                          >
                            <FaGithub size={20} />
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View Live Project"
                            className="text-normal transition-colors hover:text-[var(--color-accent)]"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
