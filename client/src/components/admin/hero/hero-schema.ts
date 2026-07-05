import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .nullable();

export const heroFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  introduction: z.string().trim().min(1, "Introduction is required"),
  photoUrl: optionalUrlSchema,
  resumeUrl: optionalUrlSchema,
  isGetInTouchEnabled: z.boolean(),
  isViewResumeEnabled: z.boolean(),
  isDownloadResumeEnabled: z.boolean(),
  badges: z.array(
    z.object({
      text: z.string().trim().min(1, "Badge text is required"),
      order: z.coerce.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  ),
  techHighlights: z.array(
    z.object({
      name: z.string().trim().min(1, "Tech name is required"),
      order: z.coerce.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  ),
  socialLinks: z.array(
    z.object({
      platform: z.string().trim().min(1, "Platform is required"),
      url: z.string().trim().min(1, "URL is required"),
      icon: z.string().trim().optional().or(z.literal("")).nullable(),
      order: z.coerce.number().int().min(1, "Order must be at least 1"),
      isEnabled: z.boolean()
    })
  )
});

export type THeroFormValues = z.infer<typeof heroFormSchema>;