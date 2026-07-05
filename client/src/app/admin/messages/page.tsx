import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <AdminPlaceholderPage
        title="Messages Manager"
        description="View contact messages, mark messages as read or unread, and delete old messages."
      />
    </AdminLayout>
  );
}