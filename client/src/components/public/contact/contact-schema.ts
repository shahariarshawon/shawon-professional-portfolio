import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(150, "Email cannot exceed 150 characters"),

  subject: z
    .string()
    .trim()
    .max(150, "Subject cannot exceed 150 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message cannot exceed 3000 characters"),

  website: z.string().trim().max(0, "Invalid submission")
});

export type TContactFormValues = z.infer<typeof contactFormSchema>;