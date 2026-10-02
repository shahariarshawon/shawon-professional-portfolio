import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  List,
  Settings,
  Sparkles,
  UserRound,
  Wrench
} from "lucide-react";

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    label: "Hero",
    href: "/admin/hero",
    icon: Home
  },
  {
    label: "About",
    href: "/admin/about",
    icon: UserRound
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: BriefcaseBusiness
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Sparkles
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Wrench
  },
  {
    label: "Education",
    href: "/admin/education",
    icon: GraduationCap
  },
  {
    label: "Certifications",
    href: "/admin/certifications",
    icon: Award
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: List
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Inbox
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
];