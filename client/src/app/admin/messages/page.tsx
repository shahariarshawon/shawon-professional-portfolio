import { MessagesManager } from "@/components/admin/messages/messages-manager";
import { AdminLayout } from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <MessagesManager />
    </AdminLayout>
  );
}