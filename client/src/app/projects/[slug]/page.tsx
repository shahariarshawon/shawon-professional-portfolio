import { notFound } from "next/navigation";

import { PublicLayout } from "@/components/layout/public-layout";
import { getProjectBySlug } from "@/lib/public-api";

type TProjectDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailsPage({
  params
}: TProjectDetailsPageProps) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-custom">
          <p className="text-sm font-medium text-accent">Project Details</p>

          <h1 className="mt-4 text-4xl font-bold text-highlight">
            {project.name}
          </h1>

          <p className="mt-6 max-w-3xl leading-8 text-normal">
            {project.shortDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-site bg-card px-4 py-2 text-sm text-highlight"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-site bg-card p-6">
            <h2 className="text-xl font-semibold text-highlight">Features</h2>

            <ul className="mt-4 space-y-3">
              {project.features.map((feature) => (
                <li key={feature.id} className="text-normal">
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}