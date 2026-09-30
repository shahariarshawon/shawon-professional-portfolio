import { ExperienceManager } from "@/components/admin/cms/experience-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminExperiencePage() {
  return (
    <AdminLayout>
      <ExperienceManager />
    </AdminLayout>
  );
}