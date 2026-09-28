import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminExperiencePage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Experience Manager"
        description="Create, edit, reorder, and remove work experience records, bullets, metrics, and company logos."
      />
    </AdminLayout>
  );
}