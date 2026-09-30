import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import prisma from "../utils/prisma";
import catchAsync from "../utils/catchAsync";

export const requirePermission = (resource: string, action: string) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) {
      throw new AppError(401, "Authentication required");
    }

    // SUPER_ADMIN has full permissions across all resources
    if (req.admin.role === "SUPER_ADMIN") {
      return next();
    }

    const permission = await prisma.adminPermission.findUnique({
      where: {
        adminId_resource_action: {
          adminId: req.admin.adminId,
          resource,
          action
        }
      }
    });

    if (!permission) {
      throw new AppError(
        403,
        `You do not have ${action} permission on ${resource}`
      );
    }

    next();
  });
};
