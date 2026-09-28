"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getCurrentAdmin, loginAdmin, logoutAdmin } from "@/lib/auth-api";
import { TLoginPayload } from "@/types/auth";

export function useAdminAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const adminQuery = useQuery({
    queryKey: ["current-admin"],
    queryFn: getCurrentAdmin,
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: (payload: TLoginPayload) => loginAdmin(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["current-admin"]
      });

      router.replace("/admin");
    }
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: ["current-admin"]
      });

      router.replace("/admin/login");
    }
  });

  return {
    admin: adminQuery.data || null,
    isAdminLoading: adminQuery.isLoading,
    isAdminError: adminQuery.isError,
    isAuthenticated: Boolean(adminQuery.data),

    loginAdmin: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    logoutAdmin: logoutMutation.mutate,
    isLogoutLoading: logoutMutation.isPending
  };
}