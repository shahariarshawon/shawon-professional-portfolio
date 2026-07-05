"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResumeBuilder } from "@/components/admin/resume/resume-builder";
import { LoadingState } from "@/components/shared/loading-state";
import { Card } from "@/components/ui/card";
import { getAdminResume } from "@/lib/admin-api";
import { getErrorMessage } from "@/lib/get-error-message";

export function ResumeManager() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-resume"],
    queryFn: getAdminResume
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold text-highlight">
          Could not load resume
        </h2>

        <p className="mt-2 text-sm text-normal">{getErrorMessage(error)}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Resume Builder"
        title="Build ATS-Friendly Resume"
        description="Create and edit a role-focused resume using summary, sections, projects, and skill keywords."
      />

      <ResumeBuilder key={data?.id || "resume-builder"} resume={data || null} />
    </div>
  );
}