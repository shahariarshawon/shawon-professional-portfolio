import { Compass, Heart, Rocket, Sparkles, Target } from "lucide-react";

import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TAboutSection } from "@/types/portfolio";

type TAboutSectionProps = {
  about: TAboutSection | null;
};

export function AboutSection({ about }: TAboutSectionProps) {
  const currentStatus =
    about?.currentStatus ||
    "I am a backend-focused developer from Bangladesh with hands-on experience building RESTful APIs, authentication systems, and database-driven applications.";
  const journey =
    about?.programmingJourney ||
    "My programming journey started with problem solving and gradually moved toward building real-world web applications.";
  const enjoyment =
    about?.workEnjoyment ||
    "I enjoy designing clean backend architectures, working with databases, building secure authentication systems, and connecting frontend applications with powerful APIs.";

  const pillars = [
    {
      icon: Target,
      label: "Currently focused on",
      text:
        about?.backendInterest ||
        "Production-level backend development: Node.js, TypeScript, PostgreSQL, backend architecture and scalable system design."
    },
    {
      icon: Rocket,
      label: "Where I'm heading",
      text:
        about?.futurePlan ||
        "Designing scalable systems, working with cloud infrastructure and contributing to professional engineering teams globally."
    },
    {
      icon: Heart,
      label: "How I work",
      text:
        about?.personality ||
        "Curious, detail-oriented and calm under pressure — I like understanding a problem end to end before writing code."
    }
  ];

  const quickFacts = (about?.quickFacts || []).filter((fact) => fact.isEnabled !== false);

  return (
    <Section id="about">
      <SectionHeading
        index="01"
        eyebrow="About"
        title="Engineer by craft,"
        highlight="builder by nature."
        description="I care about the parts users never see — clean data models, secure auth, reliable APIs — because that's what makes the parts they do see feel effortless."
      />

      <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-12">
        {/* Story */}
        <Reveal className="lg:col-span-7">
          <Card variant="gradient" className="h-full p-7 sm:p-10">
            <IconTile tone="glass" size="sm">
              <Compass size={18} />
            </IconTile>
            <p className="mt-6 font-display text-xl leading-snug tracking-tight text-fg text-pretty sm:text-2xl">
              {currentStatus}
            </p>
            <div className="mt-6 space-y-4 text-base leading-8 text-muted">
              <p>{journey}</p>
              <p>{enjoyment}</p>
            </div>
            {about?.hobbies ? (
              <p className="mt-6 flex items-start gap-2 border-t border-line pt-6 text-sm leading-7 text-muted">
                <Sparkles size={16} className="mt-1.5 shrink-0 text-brand" />
                <span>
                  <span className="font-medium text-fg">Off the clock: </span>
                  {about.hobbies}
                </span>
              </p>
            ) : null}
          </Card>
        </Reveal>

        {/* Portrait / Quick facts */}
        <div className="grid gap-5 lg:col-span-5">
          {about?.imageUrl ? (
            <Reveal delay={0.05}>
              <div className="glass overflow-hidden rounded-3xl p-2 shadow-soft">
                <ImageReveal
                  src={about.imageUrl}
                  alt="About portrait"
                  className="aspect-[4/3] rounded-[1.25rem]"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.1} className="h-full">
            <Card variant="glass" className="h-full p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 text-fg">Quick facts</h3>
                <span className="text-eyebrow text-muted">At a glance</span>
              </div>

              {quickFacts.length ? (
                <dl className="mt-6 divide-y divide-(--color-border)">
                  {quickFacts.map((fact) => (
                    <div key={fact.id} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="text-eyebrow leading-6 text-brand">{fact.label}</dt>
                      <dd className="text-sm font-medium leading-6 text-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-6 text-sm leading-7 text-muted">
                  Backend-focused developer based in Bangladesh, open to remote roles.
                </p>
              )}
            </Card>
          </Reveal>
        </div>
      </div>

      {/* Pillars */}
      <RevealGroup className="mt-5 grid gap-5 md:grid-cols-3">
        {pillars.map(({ icon: Icon, label, text }) => (
          <RevealItem key={label} className="h-full">
            <SpotlightCard className="h-full p-7">
              <IconTile>
                <Icon size={20} />
              </IconTile>
              <p className="mt-6 text-eyebrow text-muted">{label}</p>
              <p className="mt-3 text-sm leading-7 text-fg/90">{text}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
