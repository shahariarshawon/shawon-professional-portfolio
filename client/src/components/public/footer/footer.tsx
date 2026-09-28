import { ArrowUp, Mail } from "lucide-react";

import { TFooter } from "@/types/portfolio";
import { FaGithub, FaLinkedin } from "react-icons/fa";

type TFooterProps = {
  footer: TFooter;
};

export function Footer({ footer }: TFooterProps) {
  return (
    <footer className="border-t border-site py-10">
      <div className="container-custom">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <h2 className="text-2xl font-bold text-highlight">
              {footer?.name || "AL Shahariar Arafat Shawon"}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-normal">
              {footer?.tagline ||
                "Backend Developer building secure and scalable web applications."}
            </p>

            <div className="mt-5 flex gap-3">
              {(footer?.socialLinks || []).map((link) => {
                const platform = link.platform.toLowerCase();

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-site bg-card text-highlight transition hover:border-(--color-accent) hover:text-accent"
                  >
                    {platform.includes("github") ? (
                      <FaGithub size={17} />
                    ) : platform.includes("linkedin") ? (
                      <FaLinkedin size={17} />
                    ) : (
                      <Mail size={17} />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {(footer?.quickLinks || []).map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-normal transition hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-site pt-6 text-sm text-normal md:flex-row md:items-center md:justify-between">
          <p>
            {footer?.copyright ||
              "© 2026 AL Shahariar Arafat Shawon. All rights reserved."}
          </p>

          <a
            href="#home"
            className="inline-flex items-center gap-2 font-medium text-highlight transition hover:text-accent"
          >
            Back to Top
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
