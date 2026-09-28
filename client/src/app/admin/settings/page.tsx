import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Site Settings"
        description="Manage SEO title, description, keywords, color settings, navbar items, footer links, and contact information."
      />
    </AdminLayout>
  );
}