import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";

type TAdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  title,
  description
}: TAdminPlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Coming Soon"
        title={title}
        description={description}
      />

      <Card className="p-8">
        <h2 className="text-xl font-bold text-highlight">
          Manager UI will be built in the next phases
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-normal">
          The protected admin layout is ready. In the upcoming phases, this page
          will connect to the backend CRUD APIs and allow editing content from
          the dashboard.
        </p>
      </Card>
    </div>
  );
}