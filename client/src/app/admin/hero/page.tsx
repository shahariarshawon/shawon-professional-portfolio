import { HeroManager } from "@/components/admin/hero/hero-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminHeroPage() {
  return (
    <AdminLayout>
      <HeroManager />
    </AdminLayout>
  );
}