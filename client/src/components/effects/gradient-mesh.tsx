import { cn } from "@/lib/utils";

type TGradientMeshProps = {
  className?: string;
  /** Slowly drift the blobs (transform-only CSS animation). */
  animated?: boolean;
};

/**
 * Soft multi-color gradient mesh. Uses pre-softened radial gradients instead
 * of filter: blur(), which keeps it cheap to composite and animate.
 */
export function GradientMesh({ className, animated = true }: TGradientMeshProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute -left-[15%] -top-[25%] h-[75vmax] w-[75vmax] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-1),transparent_62%)] will-change-transform",
          animated && "animate-mesh-a"
        )}
      />
      <div
        className={cn(
          "absolute -right-[20%] top-[5%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-2),transparent_62%)] will-change-transform",
          animated && "animate-mesh-b"
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-35%] left-[25%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-3),transparent_60%)] will-change-transform",
          animated && "animate-mesh-c"
        )}
      />
    </div>
  );
}
