import { LoadingState } from "@/components/shared/loading-state";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-site">
      <LoadingState />
    </main>
  );
}