import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProjectCTA() {
  return (
    <section className="section-padding border-t border-site">
      <div className="container-custom">
        <Card className="p-8 text-center md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
            Interested?
          </p>

          <h2 className="mt-4 text-3xl font-bold text-highlight md:text-5xl">
            Want to discuss a similar project?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-normal">
            I can help with backend API development, database design,
            authentication systems, debugging, and full-stack web applications.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Mail className="mr-2" size={18} />
              Contact Me
            </Link>

            <Link
              href="/#projects"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg"
                })
              )}
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Projects
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}