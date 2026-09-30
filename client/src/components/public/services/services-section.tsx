import {
  ArrowRight,
  Bot,
  Bug,
  Check,
  Cloud,
  Code2,
  Database,
  KeyRound,
  LayoutTemplate,
  Server,
  type LucideIcon
} from "lucide-react";

import { GradientMesh } from "@/components/effects/gradient-mesh";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";
import { TService } from "@/types/portfolio";

type TServicesSectionProps = {
  services: TService[];
};

const SERVICE_ICONS: [RegExp, LucideIcon][] = [
  [/database|schema|sql/i, Database],
  [/auth/i, KeyRound],
  [/full[- ]?stack/i, Code2],
  [/bug|debug|fix/i, Bug],
  [/portfolio|website|landing/i, LayoutTemplate],
  [/\bai\b|llm|agent|automation/i, Bot],
  [/cloud|devops|deploy/i, Cloud]
];

const getServiceIcon = (title: string) =>
  SERVICE_ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? Server;

export function ServicesSection({ services }: TServicesSectionProps) {
  return (
    <Section id="services" tone="surface">
      <SectionHeading
        index="06"
        eyebrow="Services"
        title="How I can"
        highlight="help."
        description="Backend-focused engineering support — from API and database design to debugging and complete full-stack builds."
      />

      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3" stagger={0.07}>
        {services.map((service, index) => {
          const Icon = getServiceIcon(service.title);
          const features = service.features?.filter((feature) => feature.text) ?? [];

          return (
            <RevealItem key={service.id} className="h-full">
              <SpotlightCard className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <IconTile>
                    <Icon size={20} />
                  </IconTile>
                  <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3 className="mt-8 text-h3 text-fg">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{service.description}</p>

                {features.length ? (
                  <ul className="mt-6 space-y-2 border-t border-line pt-5">
                    {features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={feature.id ?? featureIndex} className="flex gap-2.5 text-sm text-fg/85">
                        <Check size={16} className="mt-0.5 shrink-0 text-brand" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* CTA band */}
      <Reveal className="mt-16">
        <div className="glass border-gradient noise relative isolate overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
          <GradientMesh className="-z-10 opacity-80" />
          <p className="text-eyebrow text-brand">Open for work</p>
          <h3 className="mx-auto mt-5 max-w-3xl text-h2 text-balance text-fg">
            Have a system to build or a bottleneck to fix?
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Tell me about it — I usually reply within a day or two.
          </p>
          <div className="mt-10 flex justify-center">
            <Magnetic>
              <a href="#contact" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "group")}>
                Start a conversation
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
