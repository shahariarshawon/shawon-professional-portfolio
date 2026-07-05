"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { cn } from "@/lib/utils";

type TAdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: TAdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-site">
        <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          <div
            className={cn(
              "fixed inset-0 z-50 lg:hidden",
              isMobileSidebarOpen ? "block" : "hidden",
            )}
          >
            <button
              type="button"
              aria-label="Close admin menu overlay"
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            <div className="relative h-full w-70 max-w-[85vw] bg-(--color-background)">
              <button
                type="button"
                aria-label="Close admin menu"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-site bg-card text-highlight"
              >
                <X size={18} />
              </button>

              <AdminSidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>

          <div className="min-w-0">
            <AdminTopbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

            <main id="main-content" className="p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
