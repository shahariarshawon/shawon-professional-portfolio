import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

type TResumeTargetRole =
  | "BACKEND_DEVELOPER"
  | "FULL_STACK_DEVELOPER"
  | "SOFTWARE_ENGINEER";

type TResumeSectionPayload = {
  title: string;
  content: string;
  order: number;
  isEnabled: boolean;
};

type TResumeProjectPayload = {
  name: string;
  description: string;
  techStack: string[];
  liveLink?: string | null;
  githubLink?: string | null;
  order: number;
  isEnabled?: boolean;
};

type TResumeSkillPayload = {
  category: string;
  skills: string[];
  order: number;
  isEnabled?: boolean;
};

type TUpdateResumePayload = {
  title: string;
  targetRole: TResumeTargetRole;
  summary: string;
  isActive: boolean;
  sections: TResumeSectionPayload[];
  projects: TResumeProjectPayload[];
  skills: TResumeSkillPayload[];
};

const resumeInclude = {
  sections: {
    orderBy: {
      order: "asc" as const
    }
  },
  projects: {
    orderBy: {
      order: "asc" as const
    }
  },
  skills: {
    orderBy: {
      order: "asc" as const
    }
  }
};

const getActiveResume = async () => {
  const activeResume = await prisma.resume.findFirst({
    where: {
      isActive: true
    },
    include: resumeInclude
  });

  if (activeResume) {
    return activeResume;
  }

  const firstResume = await prisma.resume.findFirst({
    include: resumeInclude,
    orderBy: {
      createdAt: "desc"
    }
  });

  return firstResume;
};

const createDefaultResume = async () => {
  const result = await prisma.resume.create({
    data: {
      name: "AL Shahariar Arafat Shawon",
      designation: "Backend Developer",
      email: "shahariarshawon.dev@gmail.com",

      title: "Backend Developer Resume",
      targetRole: "BACKEND_DEVELOPER",
      summary:
        "Backend-focused developer with hands-on experience in Node.js, Express.js, TypeScript, REST API development, authentication systems, and database-driven web applications.",
      isActive: true,

      sections: {
        create: [
          {
            title: "Professional Summary",
            content:
              "Backend-focused software developer skilled in building secure APIs, authentication systems, and database-backed applications.",
            order: 1,
            isEnabled: true
          },
          {
            title: "Core Strengths",
            content:
              "REST API development, backend architecture, database design, authentication, debugging, and full-stack integration.",
            order: 2,
            isEnabled: true
          }
        ]
      },

      projects: {
        create: [
          {
            name: "Career.io",
            description:
              "A career-focused platform demonstrating authentication, REST API integration, and database-driven user workflows.",
            techStack: [
              "Next.js",
              "Node.js",
              "Express.js",
              "TypeScript",
              "PostgreSQL",
              "Prisma"
            ],
            liveLink: "",
            githubLink: "",
            order: 1
          }
        ]
      },

      skills: {
        create: [
          {
            category: "Backend",
            skills: ["Node.js", "Express.js", "REST API", "JWT", "Prisma"],
            order: 1
          },
          {
            category: "Database",
            skills: ["PostgreSQL", "MongoDB", "Database Design"],
            order: 2
          }
        ]
      }
    },
    include: resumeInclude
  });

  return result;
};

const getResumeForAdmin = async () => {
  const resume = await getActiveResume();

  if (resume) {
    return resume;
  }

  return createDefaultResume();
};

const updateActiveResume = async (payload: TUpdateResumePayload) => {
  const existingResume = await getResumeForAdmin();

  if (!existingResume) {
    throw new AppError(404, "Resume not found");
  }

  if (payload.isActive) {
    await prisma.resume.updateMany({
      where: {
        id: {
          not: existingResume.id
        }
      },
      data: {
        isActive: false
      }
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.resumeSection.deleteMany({
      where: {
        resumeId: existingResume.id
      }
    });

    await tx.resumeProject.deleteMany({
      where: {
        resumeId: existingResume.id
      }
    });

    await tx.resumeSkill.deleteMany({
      where: {
        resumeId: existingResume.id
      }
    });

    return tx.resume.update({
      where: {
        id: existingResume.id
      },
      data: {
        title: payload.title,
        targetRole: payload.targetRole,
        summary: payload.summary,
        isActive: payload.isActive,

        sections: {
          create: payload.sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            order: section.order || index + 1,
            isEnabled: section.isEnabled
          }))
        },

        projects: {
          create: payload.projects.map((project, index) => ({
            name: project.name,
            description: project.description,
            techStack: project.techStack,
            liveLink: project.liveLink || "",
            githubLink: project.githubLink || "",
            order: project.order || index + 1
          }))
        },

        skills: {
          create: payload.skills.map((skill, index) => ({
            category: skill.category,
            skills: skill.skills,
            order: skill.order || index + 1
          }))
        }
      },
      include: resumeInclude
    });
  });

  return result;
};

export const ResumeService = {
  getResumeForAdmin,
  updateActiveResume
};