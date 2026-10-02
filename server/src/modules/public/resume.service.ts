import cloudinary from "../../config/cloudinary";
import { isCloudinaryConfigured } from "../../config/env";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

type TResumeMode = "view" | "download";

export type TResumeFile =
  | { kind: "redirect"; url: string }
  | { kind: "file"; buffer: Buffer; fileName: string };

type TCloudinaryAsset = {
  resourceType: "image" | "raw";
  type: string;
  publicId: string;
  format: string;
  secureUrl: string;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 20_000;

// A resume is a single small file; keeping it in memory spares Cloudinary (and
// the visitor) a round trip on every click.
const cache = new Map<string, { buffer: Buffer; expiresAt: number }>();

const CLOUDINARY_URL_PATTERN =
  /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|raw)\/([a-z]+)\/(?:v\d+\/)?(.+)$/i;

export const parseCloudinaryUrl = (url: string): TCloudinaryAsset | null => {
  const match = CLOUDINARY_URL_PATTERN.exec(url.split(/[?#]/)[0]);

  if (!match) return null;

  const resourceType = match[1].toLowerCase() as "image" | "raw";
  const type = match[2].toLowerCase();
  const path = decodeURIComponent(match[3]);

  // Image assets store the public_id without its extension; raw assets keep it.
  const extensionIndex = path.lastIndexOf(".");
  const hasExtension = extensionIndex > path.lastIndexOf("/");

  return {
    resourceType,
    type,
    publicId:
      resourceType === "image" && hasExtension ? path.slice(0, extensionIndex) : path,
    format: resourceType === "image" && hasExtension ? path.slice(extensionIndex + 1) : "",
    secureUrl: url.replace(/^http:/i, "https:")
  };
};

const isPdf = (buffer: Buffer) => buffer.subarray(0, 1024).includes("%PDF-");

const fetchBuffer = async (url: string) => {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (!isPdf(buffer)) {
    throw new Error("response is not a PDF");
  }

  return buffer;
};

/**
 * Cloudinary can refuse unauthenticated delivery of PDFs (notably anything
 * stored under /image/upload/, which fails with `401 deny or ACL failure`).
 * A signed API download isn't subject to that restriction, so it is tried first
 * and works for resumes uploaded before the raw-upload fix too. Direct delivery
 * is the fallback for accounts where it is allowed.
 */
const downloadFromCloudinary = async (asset: TCloudinaryAsset) => {
  const signedUrl = cloudinary.utils.private_download_url(
    asset.publicId,
    asset.format,
    {
      resource_type: asset.resourceType,
      type: asset.type
    }
  );

  const attempts = [signedUrl, asset.secureUrl];
  const failures: string[] = [];

  for (const url of attempts) {
    try {
      return await fetchBuffer(url);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  console.error("[resume] Cloudinary download failed:", failures.join(" | "));

  throw new AppError(
    502,
    "The resume file could not be retrieved from storage. Please re-upload it from the admin dashboard."
  );
};

const toFileName = (name: string) => {
  const slug = name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${slug || "Resume"}-Resume.pdf`;
};

const getResume = async (mode: TResumeMode): Promise<TResumeFile> => {
  const hero = await prisma.heroSection.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      name: true,
      resumeUrl: true,
      isViewResumeEnabled: true,
      isDownloadResumeEnabled: true
    }
  });

  const isEnabled =
    mode === "view" ? hero?.isViewResumeEnabled : hero?.isDownloadResumeEnabled;

  if (!hero?.resumeUrl || !isEnabled) {
    throw new AppError(404, "Resume is not available");
  }

  const resumeUrl = hero.resumeUrl.trim();

  if (!/^https?:\/\//i.test(resumeUrl)) {
    throw new AppError(404, "Resume is not available");
  }

  const asset = parseCloudinaryUrl(resumeUrl);

  // Externally hosted resume (Google Drive, personal site...): nothing to proxy.
  if (!asset) {
    return { kind: "redirect", url: resumeUrl };
  }

  if (!isCloudinaryConfigured()) {
    return { kind: "redirect", url: asset.secureUrl };
  }

  const fileName = toFileName(hero.name);
  const cached = cache.get(resumeUrl);

  if (cached && cached.expiresAt > Date.now()) {
    return { kind: "file", buffer: cached.buffer, fileName };
  }

  const buffer = await downloadFromCloudinary(asset);

  cache.set(resumeUrl, { buffer, expiresAt: Date.now() + CACHE_TTL_MS });

  return { kind: "file", buffer, fileName };
};

export const ResumeService = {
  getResume
};
