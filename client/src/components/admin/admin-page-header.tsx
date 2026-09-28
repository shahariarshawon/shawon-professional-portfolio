type TAdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description
}: TAdminPageHeaderProps) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="mt-2 text-3xl font-bold text-highlight md:text-4xl">
        {title}
      </h1>

      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-normal md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}