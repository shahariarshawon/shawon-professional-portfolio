import React from "react";
import { AlertCircle, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TProject } from "@/types/portfolio";

type TProjectProblemSolutionProps = {
  project: TProject;
};

export function ProjectProblemSolution({ project }: TProjectProblemSolutionProps) {
  if (!project.problem && !project.solution) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom space-y-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            Case Study Deep-Dive
          </p>
          <h2 className="mt-3 text-3xl font-bold text-highlight md:text-5xl">
            The Problem & The Architectural Solution
          </h2>
          <p className="mt-4 max-w-2xl text-base text-normal">
            Addressing real-world performance, concurrency, and reliability constraints.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Problem Card */}
          {project.problem ? (
            <Card className="p-8 border-red-500/20 bg-red-500/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                    The Challenge
                  </span>
                  <h3 className="text-xl font-bold text-highlight">Problem Statement</h3>
                </div>
              </div>

              <div className="text-sm leading-7 text-normal whitespace-pre-line pt-2">
                {project.problem}
              </div>
            </Card>
          ) : null}

          {/* Solution Card */}
          {project.solution ? (
            <Card className="p-8 border-(--color-accent)/30 bg-(--color-accent)/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                  <Cpu size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                    Engineered Approach
                  </span>
                  <h3 className="text-xl font-bold text-highlight">Implemented Solution</h3>
                </div>
              </div>

              <div className="text-sm leading-7 text-normal whitespace-pre-line pt-2">
                {project.solution}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
