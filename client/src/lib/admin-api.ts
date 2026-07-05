import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TDashboardOverview } from "@/types/admin";

export const getDashboardOverview = async () => {
  const res = await api.get<TApiResponse<TDashboardOverview>>(
    "/admin/dashboard"
  );

  return res.data.data;
};