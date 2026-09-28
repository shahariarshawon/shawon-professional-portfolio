import * as React from "react";

import { cn } from "@/lib/utils";

type TAdminCheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function AdminCheckbox({
  label,
  description,
  className,
  ...props
}: TAdminCheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border border-site bg-(--color-background)/40 p-4",
        className
      )}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-(--color-accent)"
        {...props}
      />

      <span>
        <span className="block text-sm font-semibold text-highlight">
          {label}
        </span>

        {description ? (
          <span className="mt-1 block text-xs leading-5 text-normal">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}