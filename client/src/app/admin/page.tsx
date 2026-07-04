import { AdminLayout } from "@/components/layout/admin-layout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div>
        <p className="text-sm font-medium text-accent">Admin Dashboard</p>

        <h1 className="mt-3 text-3xl font-bold text-highlight">
          Dashboard Overview
        </h1>

        <p className="mt-4 max-w-2xl text-normal">
          This is the admin dashboard foundation. Later, this page will show
          total projects, skills, messages, resume status, and quick edit
          buttons.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-site bg-card p-6">
            <h2 className="text-lg font-semibold text-highlight">Projects</h2>
            <p className="mt-2 text-sm text-normal">Coming soon</p>
          </div>

          <div className="rounded-2xl border border-site bg-card p-6">
            <h2 className="text-lg font-semibold text-highlight">Messages</h2>
            <p className="mt-2 text-sm text-normal">Coming soon</p>
          </div>

          <div className="rounded-2xl border border-site bg-card p-6">
            <h2 className="text-lg font-semibold text-highlight">Resume</h2>
            <p className="mt-2 text-sm text-normal">Coming soon</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}