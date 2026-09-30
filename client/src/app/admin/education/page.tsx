import { EducationManager } from "@/components/admin/cms/education-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminEducationPage() {
  return (
    <AdminLayout>
      <EducationManager />
    </AdminLayout>
  );
}