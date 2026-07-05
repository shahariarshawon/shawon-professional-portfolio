import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Services Manager"
        description="Create and manage backend services, full-stack services, debugging services, and portfolio website services."
      />
    </AdminLayout>
  );
}