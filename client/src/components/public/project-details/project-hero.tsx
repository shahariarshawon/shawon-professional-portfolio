import { ArrowLeft, ExternalLink, Globe, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TProject } from "@/types/portfolio";
import { FaGithub } from "react-icons/fa";

type TProjectHeroProps = {
  project: TProject;
};

export function ProjectHero({ project }: TProjectHeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-(--color-accent)/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-(--color-accent)/10 blur-3xl" />

      <div className="container-custom relative">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-normal transition hover:text-accent"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <div className="mt-10 max-w-5xl">
          {project.isFeatured ? (
            <span className="rounded-full border border-(--color-accent)/30 bg-(--color-accent)/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Featured Project
            </span>
          ) : null}

          <h1 className="mt-6 text-4xl font-black tracking-tight text-highlight md:text-6xl">
            {project.name}
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-normal md:text-xl">
            {project.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveLink ? (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <Globe className="mr-2" size={18} />
                Live Preview
              </a>
            ) : null}

            {project.githubLink ? (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                <FaGithub className="mr-2" size={18} />
                GitHub
              </a>
            ) : null}

            {project.clientGithubLink ? (
              <a
                href={project.clientGithubLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                <ExternalLink className="mr-2" size={18} />
                Client Code
              </a>
            ) : null}

            {project.backendGithubLink ? (
              <a
                href={project.backendGithubLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                )}
              >
                <ExternalLink className="mr-2" size={18} />
                Backend Code
              </a>
            ) : null}
          </div>

          {project.demoCredentials ? (
            <div className="mt-8 rounded-3xl border border-(--color-accent)/30 bg-(--color-accent)/10 p-5">
              <div className="flex gap-3">
                <LockKeyhole className="mt-1 shrink-0 text-accent" size={20} />
                <div>
                  <p className="font-semibold text-highlight">
                    Demo Credentials
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-normal">
                    {project.demoCredentials}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
