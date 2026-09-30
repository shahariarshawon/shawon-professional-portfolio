import { ProjectsManager } from "@/components/admin/cms/projects-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <ProjectsManager />
    </AdminLayout>
  );
}