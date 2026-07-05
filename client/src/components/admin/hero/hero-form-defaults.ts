import { THeroSection } from "@/types/portfolio";
import { THeroFormValues } from "./hero-schema";

export function getHeroFormDefaults(
  hero: THeroSection | null | undefined
): THeroFormValues {
  return {
    name: hero?.name || "AL Shahariar Arafat Shawon",
    designation:
      hero?.designation ||
      "Backend Developer | Backend-Focused Full-Stack Developer | Software Engineer",
    introduction:
      hero?.introduction ||
      "I build secure, scalable, and database-driven web applications.",
    photoUrl: hero?.photoUrl || "",
    resumeUrl: hero?.resumeUrl || "",
    isGetInTouchEnabled: hero?.isGetInTouchEnabled ?? true,
    isViewResumeEnabled: hero?.isViewResumeEnabled ?? true,
    isDownloadResumeEnabled: hero?.isDownloadResumeEnabled ?? true,
    badges: hero?.badges?.length
      ? hero.badges.map((badge, index) => ({
          text: badge.text,
          order: badge.order || index + 1,
          isEnabled: badge.isEnabled
        }))
      : [
          {
            text: "Backend Developer Intern",
            order: 1,
            isEnabled: true
          },
          {
            text: "Open to Remote Opportunities",
            order: 2,
            isEnabled: true
          }
        ],
    techHighlights: hero?.techHighlights?.length
      ? hero.techHighlights.map((tech, index) => ({
          name: tech.name,
          order: tech.order || index + 1,
          isEnabled: tech.isEnabled
        }))
      : [
          {
            name: "Node.js",
            order: 1,
            isEnabled: true
          },
          {
            name: "Express.js",
            order: 2,
            isEnabled: true
          },
          {
            name: "PostgreSQL",
            order: 3,
            isEnabled: true
          }
        ],
    socialLinks: hero?.socialLinks?.length
      ? hero.socialLinks.map((link, index) => ({
          platform: link.platform,
          url: link.url,
          icon: link.icon || "",
          order: link.order || index + 1,
          isEnabled: link.isEnabled
        }))
      : [
          {
            platform: "GitHub",
            url: "https://github.com/your-username",
            icon: "",
            order: 1,
            isEnabled: true
          },
          {
            platform: "LinkedIn",
            url: "https://linkedin.com/in/your-username",
            icon: "",
            order: 2,
            isEnabled: true
          }
        ]
  };
}