import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Projects Manager"
        description="Create and update projects, images, features, challenges, improvements, tech stack, live links, and GitHub links."
      />
    </AdminLayout>
  );
}