import * as React from "react";

import { cn } from "@/lib/utils";

type TAdminTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
  };

export function AdminTextarea({
  label,
  error,
  className,
  ...props
}: TAdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-highlight">
        {label}
      </label>

      <textarea
        className={cn(
          "w-full resize-none rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)",
          error && "border-red-500/60",
          className
        )}
        {...props}
      />

      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}