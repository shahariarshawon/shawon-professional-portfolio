import { z } from "zod";

const projectSlugValidationSchema = z.object({
  params: z.object({
    slug: z
      .string({
        required_error: "Project slug is required"
      })
      .min(1, "Project slug is required")
  })
});

export const PublicValidation = {
  projectSlugValidationSchema
};