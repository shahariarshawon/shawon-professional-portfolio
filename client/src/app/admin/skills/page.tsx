import { SkillsManager } from "@/components/admin/cms/skills-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminSkillsPage() {
  return (
    <AdminLayout>
      <SkillsManager />
    </AdminLayout>
  );
}