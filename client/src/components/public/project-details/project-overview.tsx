import { Lightbulb, Target, UsersRound, Zap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { TProject } from "@/types/portfolio";

type TProjectOverviewProps = {
  project: TProject;
};

export function ProjectOverview({ project }: TProjectOverviewProps) {
  const overviewItems = [
    {
      title: "Purpose",
      value: project.purpose,
      icon: <Target size={22} />
    },
    {
      title: "Target Users",
      value: project.targetUsers,
      icon: <UsersRound size={22} />
    },
    {
      title: "Unique Capabilities",
      value: project.uniqueCapabilities,
      icon: <Zap size={22} />
    },
    {
      title: "Authentication Details",
      value: project.authenticationDetails,
      icon: <Lightbulb size={22} />
    }
  ].filter((item) => item.value);

  if (!overviewItems.length && !project.fullDescription) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Overview
            </p>

            <h2 className="mt-3 text-3xl font-bold text-highlight md:text-5xl">
              Project context and problem focus.
            </h2>

            {project.fullDescription ? (
              <p className="mt-6 text-base leading-8 text-normal md:text-lg">
                {project.fullDescription}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4">
            {overviewItems.map((item) => (
              <Card key={item.title} className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-highlight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-normal">
                      {item.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}