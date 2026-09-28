import { TAdmin } from "@/types/auth";

export type TDashboardTotals = {
  projects: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  experiences: number;
  services: number;
};



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
  recentMessages: TContactMessage[];
};

export type TAdminAuthState = {
  admin: TAdmin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};