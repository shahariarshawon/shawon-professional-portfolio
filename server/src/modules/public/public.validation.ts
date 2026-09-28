import { z } from "zod";

const projectSlugValidationSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Project slug is required")
  })
});

export const PublicValidation = {
  projectSlugValidationSchema
};