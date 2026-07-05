"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TGlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({ error, reset }: TGlobalErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-site px-6 py-12">
      <Card className="max-w-xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-highlight">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-7 text-normal">
          An unexpected error occurred while loading this page.
        </p>

        {process.env.NODE_ENV === "development" ? (
          <p className="mt-4 rounded-2xl border border-site bg-(--color-background)/40 p-4 text-left text-xs text-normal">
            {error.message}
          </p>
        ) : null}

        <Button type="button" onClick={reset} className="mt-6">
          <RefreshCcw className="mr-2" size={17} />
          Try Again
        </Button>
      </Card>
    </main>
  );
}