import { siteConfig } from "@/constants/site";

const CLOUDINARY_VERSIONED_IMAGE = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/i;

/**
 * Adds automatic format/quality and a width cap to a Cloudinary image URL so
 * visitors download an appropriately sized WebP/AVIF instead of the original
 * upload. Anything else (other hosts, SVGs, URLs that already carry
 * transformations) is returned untouched.
 */
export function optimizeImageUrl(url: string, width = 1200) {
  if (!url || /\.svg(\?|#|$)/i.test(url)) return url;

  const match = CLOUDINARY_VERSIONED_IMAGE.exec(url);
  if (!match) return url;

  return `${match[1]}f_auto,q_auto,c_limit,w_${Math.round(width)}/${match[2]}`;
}

/**
 * Resume links go through the API, which serves the PDF with the right
 * headers whether it is viewed in the browser or downloaded, independent of
 * Cloudinary's delivery restrictions on the stored asset.
 */
export const resumeViewUrl = `${siteConfig.apiUrl}/public/resume`;
export const resumeDownloadUrl = `${siteConfig.apiUrl}/public/resume?download=1`;
