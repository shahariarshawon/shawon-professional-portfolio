import { ResumeManager } from "@/components/admin/resume/resume-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminResumePage() {
  return (
    <AdminLayout>
      <ResumeManager />
    </AdminLayout>
  );
}