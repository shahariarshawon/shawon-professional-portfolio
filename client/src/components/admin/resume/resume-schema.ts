import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .nullable();

export const resumeFormSchema = z.object({
  title: z.string().trim().min(1, "Resume title is required"),

  targetRole: z.enum([
    "BACKEND_DEVELOPER",
    "FULL_STACK_DEVELOPER",
    "SOFTWARE_ENGINEER",
    "REMOTE_JOB"
  ]),

  summary: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters"),

  isActive: z.boolean(),

  sections: z.array(
    z.object({
      title: z.string().trim().min(1, "Section title is required"),
      content: z.string().trim().min(1, "Section content is required"),
      order: z.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  ),

  projects: z.array(
    z.object({
      name: z.string().trim().min(1, "Project name is required"),
      description: z.string().trim().min(1, "Project description is required"),
      techStackText: z.string().trim().min(1, "Tech stack is required"),
      liveLink: optionalUrlSchema,
      githubLink: optionalUrlSchema,
      order: z.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  ),

  skills: z.array(
    z.object({
      category: z.string().trim().min(1, "Skill category is required"),
      skillsText: z.string().trim().min(1, "Skills are required"),
      order: z.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  )
});

export type TResumeFormValues = z.infer<typeof resumeFormSchema>;