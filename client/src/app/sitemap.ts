import type { MetadataRoute } from "next";

import { siteConfig } from "@/constants/site";
import { getProjects } from "@/lib/public-api";

// Regenerated at most hourly; project URLs track the CMS.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];

  try {
    const projects = await getProjects();

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: project.isFeatured ? 0.9 : 0.7
    }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}