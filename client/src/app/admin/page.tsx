import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  );
}