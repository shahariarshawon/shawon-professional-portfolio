"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems } from "@/constants/admin-nav";
import { cn } from "@/lib/utils";

type TAdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: TAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-site bg-card">
      <div className="border-b border-site p-6">
        <Link href="/admin" className="text-xl font-bold text-highlight">
          Shawon<span className="text-accent">.</span> Admin
        </Link>

        <p className="mt-2 text-xs text-normal">Portfolio content management</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-(--color-accent) text-white"
                  : "text-normal hover:bg-(--color-accent)/10 hover:text-highlight",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-site p-4">
        <Link
          href="/"
          className="block rounded-2xl border border-site px-4 py-3 text-center text-sm font-medium text-highlight transition hover:border-(--color-accent)hover:text-accent"
        >
          View Portfolio
        </Link>
      </div>
    </aside>
  );
}
