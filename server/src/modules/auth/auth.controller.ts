import { Request, Response } from "express";
import { env } from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import { AuthCookieUtils } from "../../utils/authCookie";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../errors/AppError";

const REFRESH_COOKIE_NAME = "shawon_admin_refresh_token";

const login = catchAsync(async (req: Request, res: Response) => {
  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const result = await AuthService.loginAdmin(req.body, { ipAddress, userAgent });

  res.cookie(
    env.authCookieName,
    result.accessToken,
    AuthCookieUtils.getAuthCookieOptions()
  );

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    AuthCookieUtils.getRefreshTokenCookieOptions()
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin logged in successfully",
    data: {
      admin: result.admin,
      token: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (!token) {
    throw new AppError(401, "Refresh token is required");
  }

  const ipAddress = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const result = await AuthService.refreshAccessToken(token, { ipAddress, userAgent });

  res.cookie(
    env.authCookieName,
    result.accessToken,
    AuthCookieUtils.getAuthCookieOptions()
  );

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    AuthCookieUtils.getRefreshTokenCookieOptions()
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Access token refreshed successfully",
    data: {
      admin: result.admin,
      token: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenValue = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (refreshTokenValue) {
    await AuthService.logoutAdmin(refreshTokenValue);
  }

  res.clearCookie(env.authCookieName, {
    ...AuthCookieUtils.getAuthCookieOptions(),
    maxAge: undefined
  });

  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...AuthCookieUtils.getRefreshTokenCookieOptions(),
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
    throw new AppError(401, "Admin information missing from request");
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
  refreshToken,
  logout,
  me,
  protectedTest
};