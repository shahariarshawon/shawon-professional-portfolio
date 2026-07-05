import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminResumePage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Resume Builder"
        description="Build ATS-friendly resumes for backend developer, full-stack developer, software engineer, and remote job roles."
      />
    </AdminLayout>
  );
}