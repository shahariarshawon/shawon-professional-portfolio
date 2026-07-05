"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { TNavbarItem } from "@/types/portfolio";

type TNavbarProps = {
  items: TNavbarItem[];
};

export function Navbar({ items }: TNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = items
      .map((item) => item.href.replace("#", ""))
      .filter(Boolean);

    const handleScroll = () => {
      let currentSection = "home";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (!section) {
          return;
        }

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const navItems = items.length
    ? items
    : [
        { id: "home", label: "Home", href: "#home", order: 1, isEnabled: true },
        {
          id: "about",
          label: "About",
          href: "#about",
          order: 2,
          isEnabled: true,
        },
        {
          id: "experience",
          label: "Experience",
          href: "#experience",
          order: 3,
          isEnabled: true,
        },
        {
          id: "skills",
          label: "Skills",
          href: "#skills",
          order: 4,
          isEnabled: true,
        },
        {
          id: "projects",
          label: "Projects",
          href: "#projects",
          order: 5,
          isEnabled: true,
        },
        {
          id: "education",
          label: "Education",
          href: "#education",
          order: 6,
          isEnabled: true,
        },
        {
          id: "services",
          label: "Services",
          href: "#services",
          order: 7,
          isEnabled: true,
        },
        {
          id: "contact",
          label: "Contact",
          href: "#contact",
          order: 8,
          isEnabled: true,
        },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-site bg-(--color-background)/80 backdrop-blur-xl">
      <div className="container-custom flex h-16 items-center justify-between">
        <a href="#home" className="text-xl font-bold text-highlight">
          Shawon<span className="text-accent">.</span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm font-medium lg:flex"
        >
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "transition hover:text-accent",
                  isActive ? "text-accent" : "text-normal",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-site bg-card text-highlight lg:hidden"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-site bg-(--color-background)/95 px-4 py-4 backdrop-blur-xl lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="container-custom grid gap-2 text-sm font-medium"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-normal transition hover:bg-card hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
