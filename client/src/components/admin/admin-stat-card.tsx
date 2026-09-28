import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

type TAdminStatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
};

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  description
}: TAdminStatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-normal">{title}</p>
          <p className="mt-3 text-3xl font-bold text-highlight">{value}</p>

          {description ? (
            <p className="mt-2 text-xs text-normal">{description}</p>
          ) : null}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent)/10 text-accent">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}