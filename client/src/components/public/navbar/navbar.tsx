"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TNavbarItem } from "@/types/portfolio";

type TNavbarProps = {
  items: TNavbarItem[];
};

const FALLBACK_ITEMS: TNavbarItem[] = [
  ["home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["services", "Services"],
  ["contact", "Contact"]
].map(([id, label], index) => ({
  id,
  label,
  href: `#${id}`,
  order: index + 1,
  isEnabled: true
}));

export function Navbar({ items }: TNavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = items.length ? items : FALLBACK_ITEMS;
  // "Home" is represented by the logo on desktop.
  const desktopItems = navItems.filter((item) => item.href !== "#home");

  /* Hash links only resolve on the homepage; elsewhere route back to it. */
  const resolveHref = (href: string) => (href.startsWith("#") && !isHome ? `/${href}` : href);

  /* Scrolled styling + hide on scroll down / show on scroll up. */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 24);
    setIsHidden(latest > 480 && latest > previous + 4);
    if (latest < previous - 4) setIsHidden(false);
  });

  /* Active section via IntersectionObserver (no scroll-handler layout reads). */
  useEffect(() => {
    if (!isHome) return;

    const sections = navItems
      .map((item) => (item.href.startsWith("#") ? document.getElementById(item.href.slice(1)) : null))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome, navItems]);

  /* Lock scroll + close on Escape while the mobile menu is open. */
  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    root.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <>
      <ScrollProgress />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
        animate={{ y: isHidden && !isOpen ? "-120%" : "0%" }}
        transition={{ duration: 0.45, ease: ease.out }}
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border px-2 pl-4 transition-[background-color,border-color,box-shadow,max-width] duration-500 ease-out-expo sm:h-16 sm:pl-5",
            isScrolled || isOpen
              ? "glass-strong border-line shadow-soft"
              : "border-transparent bg-transparent"
          )}
        >
          <Link
            href={isHome ? "#home" : "/"}
            className="group flex items-center gap-2.5"
            aria-label="Shawon — back to top"
            onClick={() => setIsOpen(false)}
          >
            <BrandMark className="h-8 w-8 transition-transform duration-500 ease-out-expo group-hover:rotate-[30deg]" />
            <span className="font-display text-lg font-semibold tracking-tight text-fg">
              Shawon<span className="text-brand-bright">.</span>
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {desktopItems.map((item) => {
                const isActive = isHome && activeSection === item.href.replace("#", "");

                return (
                  <li key={item.id} className="relative">
                    <a
                      href={resolveHref(item.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                        isActive ? "text-fg" : "text-muted hover:text-fg"
                      )}
                    >
                      {item.label}
                    </a>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-line bg-glass"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href={resolveHref("#contact")}
              className={cn(buttonVariants({ variant: "brand", size: "sm" }), "hidden sm:inline-flex")}
            >
              Let&apos;s talk
              <ArrowUpRight size={15} />
            </a>

            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen((prev) => !prev)}
              className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-fg xl:hidden"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-navigation"
            className="glass-strong fixed inset-0 z-40 flex flex-col overflow-y-auto px-6 pb-10 pt-28 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
          >
            <nav aria-label="Mobile navigation" className="mx-auto w-full max-w-lg">
              <motion.ul
                className="flex flex-col"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
                }}
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    className="overflow-hidden border-b border-line"
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }
                    }}
                  >
                    <a
                      href={resolveHref(item.href)}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-baseline justify-between py-4"
                    >
                      <span className="font-display text-3xl font-medium tracking-tight text-fg transition-colors group-hover:text-brand-bright sm:text-4xl">
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.a
                href={resolveHref("#contact")}
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: "brand", size: "lg" }), "mt-10 w-full sm:hidden")}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6, ease: ease.out } }}
                exit={{ opacity: 0 }}
              >
                Let&apos;s talk
                <ArrowUpRight size={16} />
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
