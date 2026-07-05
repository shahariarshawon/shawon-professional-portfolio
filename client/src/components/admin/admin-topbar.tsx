"use client";

import { LogOut, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";

type TAdminTopbarProps = {
  onMenuClick: () => void;
};

export function AdminTopbar({ onMenuClick }: TAdminTopbarProps) {
  const { admin, logoutAdmin, isLogoutLoading } = useAdminAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-site bg-(--color-background)/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-site bg-card text-highlight lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="text-sm font-semibold text-highlight">
              Admin Dashboard
            </p>
            <p className="text-xs text-normal">
              Manage portfolio content dynamically
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-highlight">
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs text-normal">{admin?.email}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => logoutAdmin()}
            disabled={isLogoutLoading}
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}