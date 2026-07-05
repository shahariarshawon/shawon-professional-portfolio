import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminHeroPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Hero Section Manager"
        description="Edit name, designation, introduction, photo, resume, badges, tech highlights, and social links."
      />
    </AdminLayout>
  );
}