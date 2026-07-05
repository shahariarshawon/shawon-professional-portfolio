import { CheckCircle2, Database, Layout, Server } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { TProjectFeature } from "@/types/portfolio";

type TProjectFeaturesProps = {
  features: TProjectFeature[];
};

const getFeatureIcon = (type?: string | null) => {
  const normalizedType = type?.toLowerCase() || "";

  if (normalizedType.includes("backend")) {
    return <Server size={22} />;
  }

  if (normalizedType.includes("database")) {
    return <Database size={22} />;
  }

  if (normalizedType.includes("frontend")) {
    return <Layout size={22} />;
  }

  return <CheckCircle2 size={22} />;
};

const getFeatureLabel = (type?: string | null) => {
  if (!type) {
    return "Feature";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function ProjectFeatures({ features }: TProjectFeaturesProps) {
  if (!features.length) {
    return null;
  }

  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Features"
          title="Core features and implementation highlights."
          description="This section explains the important functional parts of the project and what was implemented."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.id} className="p-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                  {getFeatureIcon(feature.type)}
                </div>

                <div>
                  <span className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-xs font-semibold text-accent">
                    {getFeatureLabel(feature.type)}
                  </span>

                  {feature.title ? (
                    <h3 className="mt-4 text-lg font-bold text-highlight">
                      {feature.title}
                    </h3>
                  ) : null}

                  <p className="mt-3 text-sm leading-7 text-normal">
                    {feature.text}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}