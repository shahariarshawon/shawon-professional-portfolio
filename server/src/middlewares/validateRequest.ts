import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body ?? {},
      cookies: req.cookies ?? {},
      params: req.params ?? {},
      query: req.query ?? {}
    });

    next();
  };
};

export default validateRequest;