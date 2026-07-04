import { AdminRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { JwtUtils } from "../../utils/jwt";
import prisma from "../../utils/prisma";

const requireAuth = (...requiredRoles: AdminRole[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.[env.authCookieName];

    if (!token) {
      throw new AppError(401, "You are not authenticated");
    }

    const decoded = JwtUtils.verifyToken(token);

    const admin = await prisma.adminUser.findUnique({
      where: {
        id: decoded.adminId
      }
    });

    if (!admin) {
      throw new AppError(401, "Admin account no longer exists");
    }

    if (!admin.isActive) {
      throw new AppError(403, "This admin account is inactive");
    }

    if (requiredRoles.length && !requiredRoles.includes(admin.role)) {
      throw new AppError(403, "You are not authorized to access this resource");
    }

    req.admin = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();
  });
};

export const AuthMiddleware = {
  requireAuth
};