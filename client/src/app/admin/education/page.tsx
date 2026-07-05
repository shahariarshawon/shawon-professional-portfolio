import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminEducationPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Education and Certifications Manager"
        description="Manage education records, certifications, credential links, certificate files, and display order."
      />
    </AdminLayout>
  );
}