export type TResumeTargetRole =
  | "BACKEND_DEVELOPER"
  | "FULL_STACK_DEVELOPER"
  | "SOFTWARE_ENGINEER";

export type TResumeSection = {
  id: string;
  resumeId: string;
  title: string;
  content: string;
  order: number;
  isEnabled: boolean;
};

export type TResumeProject = {
  id: string;
  resumeId: string;
  name: string;
  description: string;
  techStack: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  order: number;
  isEnabled?: boolean;
};

export type TResumeSkill = {
  id: string;
  resumeId: string;
  category: string;
  skills: string[];
  order: number;
  isEnabled?: boolean;
};

export type TResume = {
  id: string;
  title: string;
  targetRole: TResumeTargetRole;
  summary: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: TResumeSection[];
  projects: TResumeProject[];
  skills: TResumeSkill[];
};

export type TResumeUpdatePayload = {
  title: string;
  targetRole: TResumeTargetRole;
  summary: string;
  isActive: boolean;
  sections: {
    title: string;
    content: string;
    order: number;
    isEnabled: boolean;
  }[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
    liveLink?: string | null;
    githubLink?: string | null;
    order: number;
    isEnabled: boolean;
  }[];
  skills: {
    category: string;
    skills: string[];
    order: number;
    isEnabled: boolean;
  }[];
};