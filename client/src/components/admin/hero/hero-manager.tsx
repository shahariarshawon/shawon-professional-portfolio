"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroForm } from "@/components/admin/hero/hero-form";
import { LoadingState } from "@/components/shared/loading-state";
import { Card } from "@/components/ui/card";
import { getAdminHero } from "@/lib/admin-api";
import { getErrorMessage } from "@/lib/get-error-message";

export function HeroManager() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: getAdminHero
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold text-highlight">
          Could not load Hero section
        </h2>

        <p className="mt-2 text-sm text-normal">{getErrorMessage(error)}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Hero Manager"
        title="Edit Hero Section"
        description="Manage your main portfolio identity, call-to-action buttons, profile photo, resume, badges, tech highlights, and social links."
      />

      <HeroForm key={data?.id || "new-hero"} hero={data || null} />
    </div>
  );
}