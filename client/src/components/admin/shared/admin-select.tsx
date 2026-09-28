import * as React from "react";

import { cn } from "@/lib/utils";

type TAdminSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export function AdminSelect({
  label,
  error,
  options,
  className,
  ...props
}: TAdminSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-highlight">
        {label}
      </label>

      <select
        className={cn(
          "w-full rounded-2xl border border-site bg-(--color-background) px-4 py-3 text-sm text-highlight outline-none transition focus:border-(--color-accent)",
          error && "border-red-500/60",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-(--color-background) text-highlight"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}