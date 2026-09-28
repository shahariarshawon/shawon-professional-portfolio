import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please provide a valid email address")
    ),

    password: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
    )
  })
});

export const AuthValidation = {
  loginValidationSchema
};