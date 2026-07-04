import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-site px-6">
      <div className="w-full max-w-md rounded-2xl border border-site bg-card p-8">
        <p className="text-sm font-medium text-accent">Admin Login</p>

        <h1 className="mt-3 text-3xl font-bold text-highlight">
          Sign in to dashboard
        </h1>

        <p className="mt-3 text-sm text-normal">
          Login form functionality will be connected in the admin frontend
          phase.
        </p>

        <div className="mt-8 space-y-4">
          <input
            disabled
            placeholder="Email"
            className="w-full rounded-xl border border-site bg-transparent px-4 py-3 text-sm"
          />

          <input
            disabled
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-site bg-transparent px-4 py-3 text-sm"
          />

          <Button disabled className="w-full">
            Login Coming Soon
          </Button>
        </div>
      </div>
    </main>
  );
}