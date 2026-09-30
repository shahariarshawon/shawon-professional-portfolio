/**
 * Runs a script synchronously during HTML parsing (before first paint) on
 * hard loads. On the client it renders as inert text/plain so React doesn't
 * warn about script tags; suppressHydrationWarning absorbs the type mismatch.
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
