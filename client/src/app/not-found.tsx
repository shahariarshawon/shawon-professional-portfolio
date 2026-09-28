import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-site px-6 py-12">
      <Card className="max-w-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold text-highlight">
          Page not found
        </h1>

        <p className="mt-4 text-sm leading-7 text-normal">
          The page you are looking for may have been moved, deleted, or does not
          exist.
        </p>

        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-7")}>
          <ArrowLeft className="mr-2" size={18} />
          Back to Home
        </Link>
      </Card>
    </main>
  );
}