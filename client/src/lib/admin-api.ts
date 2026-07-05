import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TContactMessage, TDashboardOverview } from "@/types/admin";
import { THeroSection } from "@/types/portfolio";
import { TResume, TResumeUpdatePayload } from "@/types/resume";

export type THeroUpdatePayload = {
  name: string;
  designation: string;
  introduction: string;
  photoUrl?: string | null;
  resumeUrl?: string | null;
  isGetInTouchEnabled: boolean;
  isViewResumeEnabled: boolean;
  isDownloadResumeEnabled: boolean;
  badges: {
    text: string;
    order: number;
    isEnabled: boolean;
  }[];
  techHighlights: {
    name: string;
    order: number;
    isEnabled: boolean;
  }[];
  socialLinks: {
    platform: string;
    url: string;
    icon?: string | null;
    order: number;
    isEnabled: boolean;
  }[];
};

export type TMessageStatusFilter = "ALL" | "READ" | "UNREAD";

export const getDashboardOverview = async () => {
  const res = await api.get<TApiResponse<TDashboardOverview>>(
    "/admin/dashboard"
  );

  return res.data.data;
};

export const getAdminHero = async () => {
  const res = await api.get<TApiResponse<THeroSection>>("/admin/hero");
  return res.data.data;
};

export const updateAdminHero = async (payload: THeroUpdatePayload) => {
  const res = await api.patch<TApiResponse<THeroSection>>(
    "/admin/hero",
    payload
  );

  return res.data.data;
};

export const getAdminMessages = async (
  status: TMessageStatusFilter = "ALL"
) => {
  const query = status === "ALL" ? "" : `?status=${status}`;

  const res = await api.get<TApiResponse<TContactMessage[]>>(
    `/admin/messages${query}`
  );

  return res.data.data || [];
};

export const markAdminMessageAsRead = async (id: string) => {
  const res = await api.patch<TApiResponse<TContactMessage>>(
    `/admin/messages/${id}/read`
  );

  return res.data.data;
};

export const markAdminMessageAsUnread = async (id: string) => {
  const res = await api.patch<TApiResponse<TContactMessage>>(
    `/admin/messages/${id}/unread`
  );

  return res.data.data;
};

export const deleteAdminMessage = async (id: string) => {
  const res = await api.delete<TApiResponse<TContactMessage>>(
    `/admin/messages/${id}`
  );

  return res.data.data;
};

export const getAdminResume = async () => {
  const res = await api.get<TApiResponse<TResume>>("/admin/resume");
  return res.data.data;
};

export const updateAdminResume = async (payload: TResumeUpdatePayload) => {
  const res = await api.patch<TApiResponse<TResume>>(
    "/admin/resume",
    payload
  );

  return res.data.data;
};