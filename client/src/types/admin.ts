import { TAdmin } from "@/types/auth";
import { TProject } from "@/types/portfolio";

export type TDashboardTotals = {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  experiences: number;
  services: number;
  certifications?: number;
  education?: number;
  blogs?: number;
  aiQueries?: number;
  pageViews?: number;
  visitors?: number;
};

export type TActivityLog = {
  id: string;
  adminId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
};

export type TContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "REPLIED" | "ARCHIVED" | "READ" | "UNREAD";
  category?: string;
  createdAt: string;
};

export type TDashboardOverview = {
  totals: TDashboardTotals;
  recentMessages: TContactMessage[];
  recentActivities?: TActivityLog[];
  popularProjects?: TProject[];
};

export type TAdminAuthState = {
  admin: TAdmin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};