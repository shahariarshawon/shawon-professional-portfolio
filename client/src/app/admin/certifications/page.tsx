import { CertificationManager } from "@/components/admin/cms/certification-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminCertificationsPage() {
  return (
    <AdminLayout>
      <CertificationManager />
    </AdminLayout>
  );
}
