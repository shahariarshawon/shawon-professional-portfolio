import { TAdmin } from "@/types/auth";

export type TDashboardTotals = {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  experiences: number;
  services: number;
};

export type TResumeStatus = {
  id: string;
  title: string;
  targetRole: string;
  updatedAt: string;
} | null;

export type TContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: "READ" | "UNREAD";
  createdAt: string;
};

export type TDashboardOverview = {
  totals: TDashboardTotals;
  resumeStatus: TResumeStatus;
  recentMessages: TContactMessage[];
};

export type TAdminAuthState = {
  admin: TAdmin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};