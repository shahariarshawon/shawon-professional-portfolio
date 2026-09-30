import { AboutManager } from "@/components/admin/cms/about-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  return (
    <AdminLayout>
      <AboutManager />
    </AdminLayout>
  );
}