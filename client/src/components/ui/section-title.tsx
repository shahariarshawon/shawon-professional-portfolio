import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

const SectionTitle = React.forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mb-12 flex flex-col gap-3",
          {
            "items-start text-left": align === "left",
            "items-center text-center": align === "center",
            "items-end text-right": align === "right",
          },
          className
        )}
        {...props}
      >
        <h2 className="text-3xl font-bold tracking-tight text-highlight sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-[85%] text-lg text-normal sm:max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

export { SectionTitle };
