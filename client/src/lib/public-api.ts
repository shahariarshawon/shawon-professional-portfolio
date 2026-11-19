import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TPortfolio, TProject } from "@/types/portfolio";

export const getPortfolio = async () => {
  try {
    const res = await api.get<TApiResponse<TPortfolio>>("/public/portfolio");
    return res.data.data;
  } catch {
    return null;
  }
};

export const getProjects = async () => {
  try {
    const res = await api.get<TApiResponse<TProject[]>>("/public/projects");
    return res.data.data || [];
  } catch {
    return [];
  }
};

export const getProjectBySlug = async (slug: string) => {
  try {
    const res = await api.get<TApiResponse<TProject>>(
      `/public/projects/${slug}`
    );

    return res.data.data;
  } catch {
    return null;
  }
};