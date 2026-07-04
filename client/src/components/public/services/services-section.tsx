import { Bug, Code2, Database, KeyRound, LayoutTemplate, Server } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TService } from "@/types/portfolio";

type TServicesSectionProps = {
  services: TService[];
};

const getServiceIcon = (title: string) => {
  const lower = title.toLowerCase();

  if (lower.includes("database")) {
    return <Database size={24} />;
  }

  if (lower.includes("authentication") || lower.includes("authorization")) {
    return <KeyRound size={24} />;
  }

  if (lower.includes("full-stack")) {
    return <Code2 size={24} />;
  }

  if (lower.includes("bug") || lower.includes("debug")) {
    return <Bug size={24} />;
  }

  if (lower.includes("portfolio") || lower.includes("website")) {
    return <LayoutTemplate size={24} />;
  }

  return <Server size={24} />;
};

export function ServicesSection({ services }: TServicesSectionProps) {
  return (
    <section id="services" className="section-padding border-t border-site">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Services"
          title="Services I can provide."
          description="Backend-focused development support for APIs, databases, authentication, debugging, and full-stack web applications."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
                {getServiceIcon(service.title)}
              </div>

              <h3 className="mt-6 text-xl font-bold text-highlight">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-normal">
                {service.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <a href="#contact" className={cn(buttonVariants({ size: "lg" }))}>
            Let&apos;s Work Together
          </a>
        </div>
      </div>
    </section>
  );
}