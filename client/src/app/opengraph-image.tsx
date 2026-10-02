import { siteConfig } from "@/constants/site";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = siteConfig.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
