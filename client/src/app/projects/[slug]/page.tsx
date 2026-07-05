import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailsView } from "@/components/public/project-details/project-details-view";
import { siteConfig } from "@/constants/site";
import { getPortfolio, getProjectBySlug } from "@/lib/public-api";

export const dynamic = "force-dynamic";

type TProjectDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: TProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return {
      title: `Project Not Found | ${siteConfig.shortName}`,
      description: "The requested project could not be found."
    };
  }

  return {
    title: `${project.name} | ${siteConfig.shortName}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.name} | ${siteConfig.shortName}`,
      description: project.shortDescription,
      url: `${siteConfig.url}/projects/${project.slug}`,
      type: "article",
      images: project.images?.[0]?.url
        ? [
            {
              url: project.images[0].url,
              alt: project.images[0].altText || project.name
            }
          ]
        : undefined
    }
  };
}

export default async function ProjectDetailsPage({
  params
}: TProjectDetailsPageProps) {
  const { slug } = await params;

  const [project, portfolio] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getPortfolio().catch(() => null)
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailsView
      project={project}
      navbar={portfolio?.navbar || []}
      footer={portfolio?.footer || null}
    />
  );
}