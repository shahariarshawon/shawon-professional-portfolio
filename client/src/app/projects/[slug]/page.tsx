import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailsView } from "@/components/public/project-details/project-details-view";
import { siteConfig } from "@/constants/site";
import { getPortfolio, getProjectBySlug, getProjects, isBuildPhase } from "@/lib/public-api";

// Statically generated and refreshed in the background (see app/page.tsx).
// Slugs not known at build time are rendered on first request, then cached.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

type TProjectDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Metadata is best-effort: a failed lookup must not break the page itself.
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return {
      title: "Project Not Found",
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
    title: project.name,
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

  // Fetched in parallel. The project is essential (errors propagate so a stale
  // cached page is kept); the navbar/footer data is not, so it degrades.
  const [project, portfolio] = await Promise.all([
    getProjectBySlug(slug),
    getPortfolio().catch((error: unknown) => {
      if (!isBuildPhase) console.warn("[project] portfolio chrome unavailable:", error);
      return null;
    }),
  ]);

  if (!project) {
    notFound();
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.shortDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/projects/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <ProjectDetailsView
        project={project}
        navbar={portfolio?.navbar || []}
        footer={portfolio?.footer || null}
      />
    </>
  );
}
