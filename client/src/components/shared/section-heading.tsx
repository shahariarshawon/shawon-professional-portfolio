import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type TSectionHeadingProps = {
  eyebrow?: string;
  /** Optional index shown before the eyebrow, e.g. "02". */
  index?: string;
  title: string;
  /** Trailing words of the title rendered with the brand gradient. */
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  highlight,
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
        <Reveal
          y={12}
          className={cn(
            "flex items-center gap-3 text-eyebrow text-brand",
            align === "center" && "justify-center"
          )}
        >
          {index ? <span className="text-muted">{index}</span> : null}
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          <span>{eyebrow}</span>
        </Reveal>
      ) : null}

      <Reveal delay={0.05}>
        <h2 className="mt-5 text-h2 text-balance text-fg">
          {title}
          {highlight ? (
            <>
              {" "}
              <span className="text-gradient">{highlight}</span>
            </>
          ) : null}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-6 text-lead text-pretty text-muted">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
