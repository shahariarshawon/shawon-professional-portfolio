import { TResume } from "@/types/resume";
import { TResumeFormValues } from "./resume-schema";

export function getResumeFormDefaults(
  resume: TResume | null | undefined
): TResumeFormValues {
  return {
    title: resume?.title || "Backend Developer Resume",
    targetRole: resume?.targetRole || "BACKEND_DEVELOPER",
    summary:
      resume?.summary ||
      "Backend-focused developer with hands-on experience in Node.js, Express.js, TypeScript, REST API development, authentication systems, and database-driven web applications.",
    isActive: resume?.isActive ?? true,
    sections: resume?.sections?.length
      ? resume.sections.map((section, index) => ({
          title: section.title,
          content: section.content,
          order: section.order || index + 1,
          isEnabled: section.isEnabled
        }))
      : [
          {
            title: "Professional Summary",
            content:
              "Backend-focused software developer skilled in building secure APIs, authentication systems, and database-backed applications.",
            order: 1,
            isEnabled: true
          }
        ],
    projects: resume?.projects?.length
      ? resume.projects.map((project, index) => ({
          name: project.name,
          description: project.description,
          techStackText: project.techStack.join(", "),
          liveLink: project.liveLink || "",
          githubLink: project.githubLink || "",
          order: project.order || index + 1,
          isEnabled: project.isEnabled
        }))
      : [
          {
            name: "Career.io",
            description:
              "A career-focused full-stack project demonstrating authentication, REST API integration, and database-driven user workflows.",
            techStackText:
              "Next.js, Node.js, Express.js, TypeScript, PostgreSQL, Prisma",
            liveLink: "",
            githubLink: "",
            order: 1,
            isEnabled: true
          }
        ],
    skills: resume?.skills?.length
      ? resume.skills.map((skill, index) => ({
          category: skill.category,
          skillsText: skill.skills.join(", "),
          order: skill.order || index + 1,
          isEnabled: skill.isEnabled
        }))
      : [
          {
            category: "Backend",
            skillsText: "Node.js, Express.js, REST API, JWT, Prisma",
            order: 1,
            isEnabled: true
          },
          {
            category: "Database",
            skillsText: "PostgreSQL, MongoDB, Database Design",
            order: 2,
            isEnabled: true
          }
        ]
  };
}