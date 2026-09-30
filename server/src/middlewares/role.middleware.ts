import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { TAdminRole } from "../types/auth";
import catchAsync from "../utils/catchAsync";

export const requireRoles = (...roles: TAdminRole[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) {
      throw new AppError(401, "Authentication required");
    }

    if (roles.length && !roles.includes(req.admin.role)) {
      throw new AppError(403, "You do not have permission to perform this action");
    }

    next();
  });
};
