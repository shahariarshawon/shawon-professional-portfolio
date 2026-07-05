import * as React from "react";

import { cn } from "@/lib/utils";

type TAdminInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function AdminInput({
  label,
  error,
  className,
  ...props
}: TAdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-highlight">
        {label}
      </label>

      <input
        className={cn(
          "w-full rounded-2xl border border-site bg-transparent px-4 py-3 text-sm text-highlight outline-none transition placeholder:text-normal focus:border-(--color-accent)",
          error && "border-red-500/60",
          className
        )}
        {...props}
      />

      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}