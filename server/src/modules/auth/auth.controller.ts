import { Request, Response } from "express";
import { env } from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import { AuthCookieUtils } from "../../utils/authCookie";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginAdmin(req.body);

  res.cookie(
    env.authCookieName,
    result.token,
    AuthCookieUtils.getAuthCookieOptions()
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin logged in successfully",
    data: {
      admin: result.admin
    }
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie(env.authCookieName, {
    ...AuthCookieUtils.getAuthCookieOptions(),
    maxAge: undefined
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin logged out successfully",
    data: null
  });
});

const me = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.admin?.adminId;

  if (!adminId) {
    throw new Error("Admin information missing from request");
  }

  const admin = await AuthService.getCurrentAdmin(adminId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Current admin fetched successfully",
    data: admin
  });
});

const protectedTest = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Protected route accessed successfully",
    data: {
      admin: req.admin
    }
  });
});

export const AuthController = {
  login,
  logout,
  me,
  protectedTest
};