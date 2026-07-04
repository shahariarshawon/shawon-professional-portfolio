import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-site px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-accent">404</p>

        <h1 className="mt-4 text-4xl font-bold text-highlight">
          Page not found
        </h1>

        <p className="mt-4 text-normal">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link href="/" className="mt-8 inline-block">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}