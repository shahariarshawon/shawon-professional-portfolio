import { cn } from "@/lib/utils";

type TProjectBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function ProjectBadge({ children, className }: TProjectBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-site bg-card px-4 py-2 text-sm font-medium text-highlight",
        className
      )}
    >
      {children}
    </span>
  );
}