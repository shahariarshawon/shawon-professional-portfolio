import { ServicesManager } from "@/components/admin/cms/services-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  return (
    <AdminLayout>
      <ServicesManager />
    </AdminLayout>
  );
}