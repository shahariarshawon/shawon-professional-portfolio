import { siteConfig } from "@/constants/site";
import { TApiResponse } from "@/types/api";
import { TPortfolio, TProject } from "@/types/portfolio";

/**
 * Server-side data access for the public site.
 *
 * Pages that use this are statically generated and re-generated in the
 * background (ISR), so visitors are served instantly from the cache and never
 * wait on the API (a free-tier backend can take 30s+ to cold start). Requests
 * are bounded by a timeout and retried once; errors propagate so Next.js keeps
 * serving the last good page instead of caching an empty one.
 */

export const REVALIDATE_SECONDS = 60;

export const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

// A build can afford to wait for a cold backend; a live regeneration cannot.
const TIMEOUT_MS = isBuildPhase ? 30_000 : 8_000;
const MAX_ATTEMPTS = 2;

export class NotFoundError extends Error {
  constructor(path: string) {
    super(`Not found: ${path}`);
    this.name = "NotFoundError";
  }
}

async function request<T>(path: string, tags: string[]): Promise<T | null> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${siteConfig.apiUrl}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS, tags },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });

      if (res.status === 404) throw new NotFoundError(path);
      if (!res.ok) throw new Error(`API ${res.status} for ${path}`);

      const body = (await res.json()) as TApiResponse<T>;
      return body.data ?? null;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      lastError = error;
    }
  }

  throw lastError;
}

export const getPortfolio = () => request<TPortfolio>("/public/portfolio", ["portfolio"]);

export const getProjects = async () =>
  (await request<TProject[]>("/public/projects", ["portfolio"])) ?? [];

/** Resolves to null when the project doesn't exist; other failures throw. */
export const getProjectBySlug = async (slug: string) => {
  try {
    return await request<TProject>(
      `/public/projects/${encodeURIComponent(slug)}`,
      ["portfolio", `project:${slug}`]
    );
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
};
