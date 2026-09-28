"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingState } from "@/components/shared/loading-state";
import { useAdminAuth } from "@/hooks/use-admin-auth";

type TAdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: TAdminGuardProps) {
  const router = useRouter();
  const { admin, isAdminLoading, isAdminError } = useAdminAuth();

  useEffect(() => {
    if (!isAdminLoading && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, isAdminLoading, router]);

  if (isAdminLoading) {
    return <LoadingState />;
  }

  if (isAdminError || !admin) {
    return <LoadingState />;
  }

  return children;
}