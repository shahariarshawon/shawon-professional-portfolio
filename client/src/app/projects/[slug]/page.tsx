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
  params,
}: TProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return {
      title: `Project Not Found | ${siteConfig.shortName}`,
      description: "The requested project could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const projectUrl = `${siteConfig.url}/projects/${project.slug}`;
  const imageUrl = project.images?.[0]?.url;

  return {
    title: `${project.name} | ${siteConfig.shortName}`,
    description: project.shortDescription,
    keywords: [
      project.name,
      ...project.techStack,
      "Backend Project",
      "Full-Stack Project",
      "Software Engineering Project",
    ],
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: `${project.name} | ${siteConfig.shortName}`,
      description: project.shortDescription,
      url: projectUrl,
      type: "article",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: project.images?.[0]?.altText || project.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteConfig.shortName}`,
      description: project.shortDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailsPage({
  params,
}: TProjectDetailsPageProps) {
  const { slug } = await params;

  const [project, portfolio] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getPortfolio().catch(() => null),
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
