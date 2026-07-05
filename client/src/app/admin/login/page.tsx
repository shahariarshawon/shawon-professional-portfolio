import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-site px-6 py-12">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <AdminLoginForm />
    </main>
  );
}