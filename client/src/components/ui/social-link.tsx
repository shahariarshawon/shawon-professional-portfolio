import * as React from "react";

import { getSocialIcon } from "@/lib/social-icons";
import { cn } from "@/lib/utils";

interface SocialLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  platform: string;
  size?: "sm" | "md";
}

const SocialLink = React.forwardRef<HTMLAnchorElement, SocialLinkProps>(
  ({ className, platform, size = "md", ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-label={platform}
        title={platform}
        className={cn(
          "glass inline-flex items-center justify-center rounded-full text-fg transition-[color,border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-[var(--color-accent-bright)]/50 hover:text-brand-bright",
          size === "md" ? "h-11 w-11" : "h-10 w-10",
          className
        )}
        {...props}
      >
        {getSocialIcon(platform, size === "md" ? 18 : 16)}
      </a>
    );
  }
);
SocialLink.displayName = "SocialLink";

export { SocialLink };
