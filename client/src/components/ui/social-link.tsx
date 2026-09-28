import * as React from "react";
import { ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SocialLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  platform: string;
}

const getSocialIcon = (platform: string) => {
  const normalized = platform.toLowerCase();
  if (normalized.includes("github")) return <FaGithub size={18} />;
  if (normalized.includes("linkedin")) return <FaLinkedin size={18} />;
  return <ExternalLink size={18} />;
};

const SocialLink = React.forwardRef<HTMLAnchorElement, SocialLinkProps>(
  ({ className, platform, ...props }, ref) => {
    return (
      <motion.a
        ref={ref}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label={platform}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-site bg-card text-highlight transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] shadow-sm",
          className
        )}
        {...(props as any)}
      >
        {getSocialIcon(platform)}
      </motion.a>
    );
  }
);
SocialLink.displayName = "SocialLink";

export { SocialLink };
