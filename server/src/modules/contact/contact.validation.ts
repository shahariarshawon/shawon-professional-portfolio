import { z } from "zod";

const createContactMessageValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(150, "Email cannot exceed 150 characters"),

    subject: z
      .string()
      .trim()
      .max(150, "Subject cannot exceed 150 characters")
      .optional()
      .or(z.literal("")),

    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(3000, "Message cannot exceed 3000 characters"),

    website: z.string().trim().optional().or(z.literal(""))
  })
});

export const ContactValidation = {
  createContactMessageValidationSchema
};