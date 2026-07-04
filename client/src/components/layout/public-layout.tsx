import { ThemeToggle } from "@/components/shared/theme-toggle";

type TPublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: TPublicLayoutProps) {
  return (
    <div className="min-h-screen bg-site">
      <header className="sticky top-0 z-50 border-b border-site bg-[var(--color-background)]/80 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between">
          <a href="#home" className="text-lg font-semibold text-highlight">
            Shawon
          </a>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#about" className="transition hover:text-accent">
              About
            </a>
            <a href="#skills" className="transition hover:text-accent">
              Skills
            </a>
            <a href="#projects" className="transition hover:text-accent">
              Projects
            </a>
            <a href="#contact" className="transition hover:text-accent">
              Contact
            </a>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}