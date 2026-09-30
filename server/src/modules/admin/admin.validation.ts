import { z } from "zod";

const idParamValidationSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Id is required")
  })
});

const bodyValidationSchema = z.object({
  body: z.object({}).passthrough()
});

const bodyWithIdParamValidationSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Id is required")
  }),
  body: z.object({}).passthrough()
});

const reorderValidationSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
        order: z.number().int()
      })
    ).min(1, "Items array must not be empty")
  })
});

export const AdminValidation = {
  idParamValidationSchema,
  bodyValidationSchema,
  bodyWithIdParamValidationSchema,
  reorderValidationSchema
};