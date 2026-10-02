import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/utils";

type TSectionEmptyProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
};

/**
 * Empty state for homepage sections whose collection has no published items.
 * States plainly what is missing and offers a next step, instead of
 * promising content "soon".
 */
export function SectionEmpty({ icon: Icon, title, description, action, className }: TSectionEmptyProps) {
  return (
    <Card
      variant="glass"
      className={cn("flex flex-col items-center gap-4 border-dashed p-10 text-center sm:p-14", className)}
    >
      <IconTile tone="glass">
        <Icon size={20} />
      </IconTile>
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-fg">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
      </div>
      {action ? (
        <a href={action.href} className={cn(buttonVariants({ variant: "glass", size: "md" }), "mt-2")}>
          {action.label}
        </a>
      ) : null}
    </Card>
  );
}
