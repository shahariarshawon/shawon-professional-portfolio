import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";
import { TContactMessage, TDashboardOverview, TActivityLog } from "@/types/admin";
import {
  TAboutSection,
  TCertification,
  TEducation,
  TExperience,
  TFooter,
  THeroSection,
  TNavbarItem,
  TProject,
  TService,
  TSiteSettings,
  TSkill,
  TSkillCategory
} from "@/types/portfolio";

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

export type TMessageStatusFilter = "ALL" | "NEW" | "CONTACTED" | "REPLIED" | "ARCHIVED" | "READ" | "UNREAD";

/* ---------------- Dashboard & Activity ---------------- */

export const getDashboardOverview = async () => {
  const res = await api.get<TApiResponse<TDashboardOverview>>("/admin/dashboard");
  return res.data.data;
};

export const getAdminActivities = async (limit: number = 20) => {
  const res = await api.get<TApiResponse<TActivityLog[]>>(`/admin/activities?limit=${limit}`);
  return res.data.data || [];
};

/* ---------------- Hero ---------------- */

export const getAdminHero = async () => {
  const res = await api.get<TApiResponse<THeroSection>>("/admin/hero");
  return res.data.data;
};

export const updateAdminHero = async (payload: THeroUpdatePayload) => {
  const res = await api.patch<TApiResponse<THeroSection>>("/admin/hero", payload);
  return res.data.data;
};

/* ---------------- About ---------------- */

export const getAdminAbout = async () => {
  const res = await api.get<TApiResponse<TAboutSection>>("/admin/about");
  return res.data.data;
};

export const updateAdminAbout = async (payload: Partial<TAboutSection>) => {
  const res = await api.patch<TApiResponse<TAboutSection>>("/admin/about", payload);
  return res.data.data;
};

/* ---------------- Navbar ---------------- */

export const getAdminNavbar = async () => {
  const res = await api.get<TApiResponse<TNavbarItem[]>>("/admin/navbar");
  return res.data.data || [];
};

export const createAdminNavbarItem = async (payload: Partial<TNavbarItem>) => {
  const res = await api.post<TApiResponse<TNavbarItem>>("/admin/navbar", payload);
  return res.data.data;
};

export const updateAdminNavbarItem = async (id: string, payload: Partial<TNavbarItem>) => {
  const res = await api.patch<TApiResponse<TNavbarItem>>(`/admin/navbar/${id}`, payload);
  return res.data.data;
};

export const deleteAdminNavbarItem = async (id: string) => {
  const res = await api.delete<TApiResponse<TNavbarItem>>(`/admin/navbar/${id}`);
  return res.data.data;
};

export const reorderAdminNavbar = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/navbar/reorder", { items });
  return res.data.data;
};

/* ---------------- Experience ---------------- */

export const getAdminExperiences = async () => {
  const res = await api.get<TApiResponse<TExperience[]>>("/admin/experience");
  return res.data.data || [];
};

export const createAdminExperience = async (payload: Partial<TExperience>) => {
  const res = await api.post<TApiResponse<TExperience>>("/admin/experience", payload);
  return res.data.data;
};

export const updateAdminExperience = async (id: string, payload: Partial<TExperience>) => {
  const res = await api.patch<TApiResponse<TExperience>>(`/admin/experience/${id}`, payload);
  return res.data.data;
};

export const deleteAdminExperience = async (id: string) => {
  const res = await api.delete<TApiResponse<TExperience>>(`/admin/experience/${id}`);
  return res.data.data;
};

export const reorderAdminExperiences = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/experience/reorder", { items });
  return res.data.data;
};

/* ---------------- Skill Categories & Skills ---------------- */

export const getAdminSkillCategories = async () => {
  const res = await api.get<TApiResponse<TSkillCategory[]>>("/admin/skill-categories");
  return res.data.data || [];
};

export const createAdminSkillCategory = async (payload: Partial<TSkillCategory>) => {
  const res = await api.post<TApiResponse<TSkillCategory>>("/admin/skill-categories", payload);
  return res.data.data;
};

export const updateAdminSkillCategory = async (id: string, payload: Partial<TSkillCategory>) => {
  const res = await api.patch<TApiResponse<TSkillCategory>>(`/admin/skill-categories/${id}`, payload);
  return res.data.data;
};

export const deleteAdminSkillCategory = async (id: string) => {
  const res = await api.delete<TApiResponse<TSkillCategory>>(`/admin/skill-categories/${id}`);
  return res.data.data;
};

export const reorderAdminSkillCategories = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/skill-categories/reorder", { items });
  return res.data.data;
};

export const getAdminSkills = async () => {
  const res = await api.get<TApiResponse<TSkill[]>>("/admin/skills");
  return res.data.data || [];
};

export const createAdminSkill = async (payload: Partial<TSkill>) => {
  const res = await api.post<TApiResponse<TSkill>>("/admin/skills", payload);
  return res.data.data;
};

export const updateAdminSkill = async (id: string, payload: Partial<TSkill>) => {
  const res = await api.patch<TApiResponse<TSkill>>(`/admin/skills/${id}`, payload);
  return res.data.data;
};

export const deleteAdminSkill = async (id: string) => {
  const res = await api.delete<TApiResponse<TSkill>>(`/admin/skills/${id}`);
  return res.data.data;
};

export const reorderAdminSkills = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/skills/reorder", { items });
  return res.data.data;
};

/* ---------------- Projects ---------------- */

export const getAdminProjects = async () => {
  const res = await api.get<TApiResponse<TProject[]>>("/admin/projects");
  return res.data.data || [];
};

export const createAdminProject = async (payload: Partial<TProject>) => {
  const res = await api.post<TApiResponse<TProject>>("/admin/projects", payload);
  return res.data.data;
};

export const updateAdminProject = async (id: string, payload: Partial<TProject>) => {
  const res = await api.patch<TApiResponse<TProject>>(`/admin/projects/${id}`, payload);
  return res.data.data;
};

export const deleteAdminProject = async (id: string) => {
  const res = await api.delete<TApiResponse<TProject>>(`/admin/projects/${id}`);
  return res.data.data;
};

export const reorderAdminProjects = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/projects/reorder", { items });
  return res.data.data;
};

/* ---------------- Education ---------------- */

export const getAdminEducation = async () => {
  const res = await api.get<TApiResponse<TEducation[]>>("/admin/education");
  return res.data.data || [];
};

export const createAdminEducation = async (payload: Partial<TEducation>) => {
  const res = await api.post<TApiResponse<TEducation>>("/admin/education", payload);
  return res.data.data;
};

export const updateAdminEducation = async (id: string, payload: Partial<TEducation>) => {
  const res = await api.patch<TApiResponse<TEducation>>(`/admin/education/${id}`, payload);
  return res.data.data;
};

export const deleteAdminEducation = async (id: string) => {
  const res = await api.delete<TApiResponse<TEducation>>(`/admin/education/${id}`);
  return res.data.data;
};

export const reorderAdminEducation = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/education/reorder", { items });
  return res.data.data;
};

/* ---------------- Certifications ---------------- */

export const getAdminCertifications = async () => {
  const res = await api.get<TApiResponse<TCertification[]>>("/admin/certifications");
  return res.data.data || [];
};

export const createAdminCertification = async (payload: Partial<TCertification>) => {
  const res = await api.post<TApiResponse<TCertification>>("/admin/certifications", payload);
  return res.data.data;
};

export const updateAdminCertification = async (id: string, payload: Partial<TCertification>) => {
  const res = await api.patch<TApiResponse<TCertification>>(`/admin/certifications/${id}`, payload);
  return res.data.data;
};

export const deleteAdminCertification = async (id: string) => {
  const res = await api.delete<TApiResponse<TCertification>>(`/admin/certifications/${id}`);
  return res.data.data;
};

export const reorderAdminCertifications = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/certifications/reorder", { items });
  return res.data.data;
};

/* ---------------- Services ---------------- */

export const getAdminServices = async () => {
  const res = await api.get<TApiResponse<TService[]>>("/admin/services");
  return res.data.data || [];
};

export const createAdminService = async (payload: Partial<TService>) => {
  const res = await api.post<TApiResponse<TService>>("/admin/services", payload);
  return res.data.data;
};

export const updateAdminService = async (id: string, payload: Partial<TService>) => {
  const res = await api.patch<TApiResponse<TService>>(`/admin/services/${id}`, payload);
  return res.data.data;
};

export const deleteAdminService = async (id: string) => {
  const res = await api.delete<TApiResponse<TService>>(`/admin/services/${id}`);
  return res.data.data;
};

export const reorderAdminServices = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/services/reorder", { items });
  return res.data.data;
};

/* ---------------- Site Settings & Footer Links ---------------- */

export const getAdminSiteSettings = async () => {
  const res = await api.get<TApiResponse<TSiteSettings>>("/admin/site-settings");
  return res.data.data;
};

export const updateAdminSiteSettings = async (payload: Partial<TSiteSettings>) => {
  const res = await api.patch<TApiResponse<TSiteSettings>>("/admin/site-settings", payload);
  return res.data.data;
};

export const getAdminFooterLinks = async () => {
  const res = await api.get<TApiResponse<any[]>>("/admin/footer-links");
  return res.data.data || [];
};

export const createAdminFooterLink = async (payload: any) => {
  const res = await api.post<TApiResponse<any>>("/admin/footer-links", payload);
  return res.data.data;
};

export const updateAdminFooterLink = async (id: string, payload: any) => {
  const res = await api.patch<TApiResponse<any>>(`/admin/footer-links/${id}`, payload);
  return res.data.data;
};

export const deleteAdminFooterLink = async (id: string) => {
  const res = await api.delete<TApiResponse<any>>(`/admin/footer-links/${id}`);
  return res.data.data;
};

export const reorderAdminFooterLinks = async (items: { id: string; order: number }[]) => {
  const res = await api.patch<TApiResponse<any>>("/admin/footer-links/reorder", { items });
  return res.data.data;
};

/* ---------------- Messages ---------------- */

export const getAdminMessages = async (status: TMessageStatusFilter = "ALL") => {
  const query = status === "ALL" ? "" : `?status=${status}`;
  const res = await api.get<TApiResponse<TContactMessage[]>>(`/admin/messages${query}`);
  return res.data.data || [];
};

export const updateAdminMessageStatus = async (id: string, status: string) => {
  const res = await api.patch<TApiResponse<TContactMessage>>(`/admin/messages/${id}/status`, {
    status
  });
  return res.data.data;
};

export const markAdminMessageAsRead = async (id: string) => {
  return updateAdminMessageStatus(id, "CONTACTED");
};

export const markAdminMessageAsUnread = async (id: string) => {
  return updateAdminMessageStatus(id, "NEW");
};

export const deleteAdminMessage = async (id: string) => {
  const res = await api.delete<TApiResponse<TContactMessage>>(`/admin/messages/${id}`);
  return res.data.data;
};
