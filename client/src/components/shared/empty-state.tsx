type TEmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: TEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-site bg-card p-8 text-center">
      <h3 className="text-lg font-semibold text-highlight">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-normal">{description}</p>
      ) : null}
    </div>
  );
}