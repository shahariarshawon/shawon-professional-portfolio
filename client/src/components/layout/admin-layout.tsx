type TAdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: TAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-site">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-site bg-card p-6 md:block">
          <h2 className="text-lg font-semibold text-highlight">Admin</h2>

          <nav className="mt-8 space-y-3 text-sm">
            <a className="block hover:text-accent" href="/admin">
              Dashboard
            </a>
            <a className="block hover:text-accent" href="/admin/hero">
              Hero
            </a>
            <a className="block hover:text-accent" href="/admin/projects">
              Projects
            </a>
            <a className="block hover:text-accent" href="/admin/settings">
              Settings
            </a>
          </nav>
        </aside>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}