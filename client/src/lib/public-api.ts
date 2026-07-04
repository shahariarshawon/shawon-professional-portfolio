import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TPortfolio, TProject } from "@/types/portfolio";

export const getPortfolio = async () => {
  const res = await api.get<TApiResponse<TPortfolio>>("/public/portfolio");
  return res.data.data;
};

export const getProjectBySlug = async (slug: string) => {
  const res = await api.get<TApiResponse<TProject>>(
    `/public/projects/${slug}`
  );

  return res.data.data;
};