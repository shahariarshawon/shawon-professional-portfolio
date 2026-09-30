import { SettingsManager } from "@/components/admin/cms/settings-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <SettingsManager />
    </AdminLayout>
  );
}