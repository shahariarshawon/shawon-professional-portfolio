import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TProjectChallenge } from "@/types/portfolio";

type TProjectChallengesProps = {
  challenges?: TProjectChallenge[];
};

export function ProjectChallenges({ challenges = [] }: TProjectChallengesProps) {
  if (!challenges.length) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Challenges"
          title="Problems faced and how they were solved."
          description="A project becomes stronger when the implementation process shows real problem-solving decisions."
        />

        <div className="mt-12 space-y-5">
          {challenges.map((item) => (
            <Card key={item.id} className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-accent" size={22} />
                    <h3 className="text-lg font-bold text-highlight">
                      Challenge
                    </h3>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-normal">
                    {item.challenge}
                  </p>
                </div>

                {item.solution ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-accent" size={22} />
                      <h3 className="text-lg font-bold text-highlight">
                        Solution
                      </h3>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-normal">
                      {item.solution}
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}