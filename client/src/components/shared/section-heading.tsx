import { cn } from "@/lib/utils";

type TSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: TSectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-highlight md:text-5xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-5 text-base leading-8 text-normal md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}