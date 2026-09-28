import { Card } from "@/components/ui/card";

type TAdminFormCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminFormCard({
  title,
  description,
  children
}: TAdminFormCardProps) {
  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-highlight">{title}</h2>

        {description ? (
          <p className="mt-2 text-sm leading-6 text-normal">{description}</p>
        ) : null}
      </div>

      {children}
    </Card>
  );
}