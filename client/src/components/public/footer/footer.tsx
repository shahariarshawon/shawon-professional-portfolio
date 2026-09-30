import { ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SocialLink } from "@/components/ui/social-link";
import { siteConfig } from "@/constants/site";
import { TFooter } from "@/types/portfolio";

type TFooterProps = {
  footer: TFooter;
};

export function Footer({ footer }: TFooterProps) {
  const name = footer?.name || siteConfig.name;
  const year = new Date().getFullYear();

  return (
    <footer className="noise relative isolate overflow-hidden border-t border-line bg-surface pt-20 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[36rem] w-[70rem] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,var(--glow-1),transparent_65%)]"
      />

      <div className="container-custom">
        <Reveal>
          <Link href="/#contact" className="group block">
            <p className="text-eyebrow text-brand">Have an idea?</p>
            <p className="mt-5 flex items-center gap-4 text-display text-fg transition-colors duration-500 group-hover:text-brand-bright">
              Let&apos;s talk
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[transform,background-color,border-color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-gradient-brand sm:h-20 sm:w-20">
                <ArrowUpRight className="h-5 w-5 text-fg sm:h-8 sm:w-8" />
              </span>
            </p>
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3">
              <BrandMark className="h-9 w-9" />
              <p className="font-display text-xl font-semibold tracking-tight text-fg">{name}</p>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              {footer?.tagline || "Backend developer building secure and scalable web applications."}
            </p>
            {footer?.socialLinks?.length ? (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {footer.socialLinks.map((link) => (
                  <SocialLink key={link.id} platform={link.platform} href={link.url} target="_blank" rel="noreferrer" size="sm" />
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-eyebrow text-muted">Navigate</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
              {(footer?.quickLinks || []).map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                    className="text-sm text-fg/80 transition-colors hover:text-brand-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-eyebrow text-muted">Say hello</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-5 inline-block break-all text-sm text-fg/80 underline-offset-4 transition-colors hover:text-brand-bright hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {footer?.copyright || `© ${year} ${name}. All rights reserved.`}
            <span className="mx-2 opacity-50">·</span>
            <Link href="/admin/login" className="transition-colors hover:text-fg" aria-label="Admin Login">
              Admin
            </Link>
          </p>

          <Magnetic strength={0.4}>
            <a
              href="#"
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-fg transition-colors hover:text-brand-bright"
            >
              Back to top
              <ArrowUp size={14} />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
