import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="About Section Manager"
        description="Edit personal overview, programming journey, backend interest, future plan, personality, hobbies, and quick facts."
      />
    </AdminLayout>
  );
}