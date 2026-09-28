import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminSkillsPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Skills Manager"
        description="Manage skill categories, individual skills, icons, levels, order, and visibility."
      />
    </AdminLayout>
  );
}