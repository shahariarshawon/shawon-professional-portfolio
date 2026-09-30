import React from "react";
import { GitBranch, Layers, TrendingUp, CheckCircle2, ZoomIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TProject } from "@/types/portfolio";

type TProjectArchitectureResultsProps = {
  project: TProject;
};

export function ProjectArchitectureResults({ project }: TProjectArchitectureResultsProps) {
  const hasArchitecture = Boolean(project.architectureDiagram || (project.architectures && project.architectures.length > 0));
  const hasResults = Boolean(project.results || (project.resultsList && project.resultsList.length > 0));

  if (!hasArchitecture && !hasResults) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom space-y-12">
        {/* Architecture Section */}
        {hasArchitecture && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                System Design
              </p>
              <h2 className="mt-3 text-3xl font-bold text-highlight md:text-5xl">
                System Architecture & Data Flow
              </h2>
              <p className="mt-3 max-w-2xl text-base text-normal">
                High-level component topology, state transitions, and caching layers.
              </p>
            </div>

            {project.architectureDiagram && (
              <Card className="p-4 md:p-6 overflow-hidden border-site bg-(--color-background)/40 group">
                <div className="relative rounded-2xl overflow-hidden border border-site/60 bg-black/20 flex items-center justify-center">
                  <img
                    src={project.architectureDiagram}
                    alt={`${project.name} Architecture Diagram`}
                    className="w-full max-h-[550px] object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                </div>
              </Card>
            )}

            {project.architectures && project.architectures.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {project.architectures.map((arch, idx) => (
                  <Card key={arch.id || idx} className="p-6 space-y-2">
                    <h3 className="text-base font-bold text-highlight flex items-center gap-2">
                      <Layers size={18} className="text-accent" />
                      {arch.title}
                    </h3>
                    <p className="text-sm leading-6 text-normal">{arch.description}</p>
                    {arch.diagramUrl && (
                      <img
                        src={arch.diagramUrl}
                        alt={arch.title}
                        className="mt-3 rounded-xl border border-site object-contain max-h-48 w-full"
                      />
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quantifiable Results Section */}
        {hasResults && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                Impact & Outcomes
              </p>
              <h2 className="mt-3 text-3xl font-bold text-highlight md:text-5xl">
                Measurable Results & Benchmarks
              </h2>
            </div>

            {project.results && (
              <Card className="p-6 text-sm leading-7 text-normal md:text-base border-emerald-500/20 bg-emerald-500/5">
                <p className="whitespace-pre-line">{project.results}</p>
              </Card>
            )}

            {project.resultsList && project.resultsList.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {project.resultsList.map((resItem, idx) => (
                  <Card
                    key={resItem.id || idx}
                    className="p-6 text-center border-(--color-accent)/30 bg-(--color-accent)/5 hover:border-(--color-accent) transition flex flex-col justify-center items-center"
                  >
                    <span className="text-3xl font-black text-accent tracking-tight">
                      {resItem.metric}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-highlight">{resItem.label}</h4>
                    {resItem.description && (
                      <p className="mt-1 text-xs text-normal">{resItem.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
