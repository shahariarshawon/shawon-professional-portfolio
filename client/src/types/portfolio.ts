export type TNavbarItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  isEnabled: boolean;
};

export type THeroBadge = {
  id: string;
  text: string;
  order: number;
  isEnabled: boolean;
};

export type THeroTechHighlight = {
  id: string;
  name: string;
  order: number;
  isEnabled: boolean;
};

export type TSocialLink = {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  order: number;
  isEnabled: boolean;
};

export type THeroSection = {
  id: string;
  name: string;
  designation: string;
  introduction: string;
  photoUrl?: string | null;
  resumeUrl?: string | null;
  isGetInTouchEnabled: boolean;
  isViewResumeEnabled: boolean;
  isDownloadResumeEnabled: boolean;
  badges: THeroBadge[];
  techHighlights: THeroTechHighlight[];
  socialLinks: TSocialLink[];
};

export type TQuickFact = {
  id: string;
  label: string;
  value: string;
  order: number;
  isEnabled: boolean;
};

export type TAboutSection = {
  id: string;
  currentStatus: string;
  programmingJourney: string;
  workEnjoyment: string;
  backendInterest: string;
  futurePlan: string;
  personality: string;
  hobbies?: string | null;
  imageUrl?: string | null;
  quickFacts: TQuickFact[];
};

export type TExperienceBullet = {
  id: string;
  text: string;
  order: number;
};

export type TExperienceMetric = {
  id: string;
  label: string;
  value: string;
  order: number;
};

export type TExperience = {
  id: string;
  companyName: string;
  role: string;
  status: "CURRENTLY_WORKING" | "COMPLETED";
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  description: string;
  companyLogo?: string | null;
  order: number;
  isEnabled: boolean;
  bullets: TExperienceBullet[];
  metrics: TExperienceMetric[];
};

export type TSkill = {
  id: string;
  name: string;
  iconUrl?: string | null;
  level?: number | null;
  order: number;
  isEnabled: boolean;
};

export type TSkillCategory = {
  id: string;
  name: string;
  order: number;
  isEnabled: boolean;
  skills: TSkill[];
};

export type TProjectImage = {
  id: string;
  url: string;
  altText?: string | null;
  fileType: "IMAGE" | "PDF" | "OTHER";
  order: number;
};

export type TProjectFeature = {
  id: string;
  title?: string | null;
  text: string;
  type?: string | null;
  order: number;
};

export type TProjectChallenge = {
  id: string;
  challenge: string;
  solution?: string | null;
  order: number;
};

export type TProjectImprovement = {
  id: string;
  improvement: string;
  order: number;
};

export type TProject = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  purpose?: string | null;
  targetUsers?: string | null;
  uniqueCapabilities?: string | null;
  techStack: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  clientGithubLink?: string | null;
  backendGithubLink?: string | null;
  demoCredentials?: string | null;
  authenticationDetails?: string | null;
  isFeatured: boolean;
  isEnabled: boolean;
  order: number;
  images: TProjectImage[];
  features: TProjectFeature[];
  challenges?: TProjectChallenge[];
  improvements?: TProjectImprovement[];
};

export type TEducation = {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  location?: string | null;
  description?: string | null;
  order: number;
  isEnabled: boolean;
};

export type TCertification = {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string | null;
  credentialId?: string | null;
  credentialLink?: string | null;
  certificateFileUrl?: string | null;
  order: number;
  isEnabled: boolean;
};

export type TService = {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
  isEnabled: boolean;
};

export type TContactInfo = {
  id: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  location?: string | null;
};

export type TFooter = {
  name: string;
  tagline: string;
  copyright: string;
  quickLinks: TNavbarItem[];
  socialLinks: TSocialLink[];
};

export type TSiteSettings = {
  id: string;
  siteTitle: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];
  accentColor: string;
  backgroundColor: string;
  normalTextColor: string;
  highlightedTextColor: string;
};

export type TPortfolio = {
  navbar: TNavbarItem[];
  hero: THeroSection | null;
  about: TAboutSection | null;
  experience: TExperience[];
  skills: TSkillCategory[];
  projects: TProject[];
  education: TEducation[];
  certifications: TCertification[];
  services: TService[];
  contactInfo: TContactInfo | null;
  footer: TFooter;
  siteSettings: TSiteSettings | null;
};