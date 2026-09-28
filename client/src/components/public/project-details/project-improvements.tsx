import { Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TProjectImprovement } from "@/types/portfolio";

type TProjectImprovementsProps = {
  improvements?: TProjectImprovement[];
};

export function ProjectImprovements({
  improvements = []
}: TProjectImprovementsProps) {
  if (!improvements.length) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Future Improvements"
          title="What can be improved next."
          description="This shows awareness of product growth, scalability, and long-term engineering improvement."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {improvements.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                  <Sparkles size={22} />
                </div>

                <p className="text-sm leading-7 text-normal">
                  {item.improvement}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}