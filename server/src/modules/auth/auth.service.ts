import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { JwtUtils } from "../../utils/jwt";
import { PasswordUtils } from "../../utils/password";
import { RefreshTokenService } from "./refresh-token.service";
import { TAdminRole } from "../../types/auth";

type TLoginPayload = {
  email: string;
  password: string;
};

type TLoginContext = {
  ipAddress?: string;
  userAgent?: string;
};

const loginAdmin = async (payload: TLoginPayload, context?: TLoginContext) => {
  const admin = await prisma.adminUser.findUnique({
    where: {
      email: payload.email
    }
  });

  if (!admin) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!admin.isActive) {
    if (context) {
      await RefreshTokenService.recordLogin(
        admin.id,
        "FAILED",
        context.ipAddress,
        context.userAgent,
        "Account inactive"
      );
    }
    throw new AppError(403, "This admin account is inactive");
  }

  const isPasswordMatched = await PasswordUtils.comparePassword(
    payload.password,
    admin.password
  );

  if (!isPasswordMatched) {
    if (context) {
      await RefreshTokenService.recordLogin(
        admin.id,
        "FAILED",
        context.ipAddress,
        context.userAgent,
        "Incorrect password"
      );
    }
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = JwtUtils.createToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role as TAdminRole
  });

  const { refreshToken } = await RefreshTokenService.createRefreshToken(
    admin.id,
    context?.ipAddress,
    context?.userAgent
  );

  if (context) {
    await RefreshTokenService.recordLogin(
      admin.id,
      "SUCCESS",
      context.ipAddress,
      context.userAgent
    );
  }

  return {
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  };
};

const refreshAccessToken = async (
  token: string,
  context?: TLoginContext
) => {
  return RefreshTokenService.rotateRefreshToken(
    token,
    context?.ipAddress,
    context?.userAgent
  );
};

const logoutAdmin = async (refreshToken?: string) => {
  if (refreshToken) {
    await RefreshTokenService.revokeRefreshToken(refreshToken);
  }
};

const getCurrentAdmin = async (adminId: string) => {
  const admin = await prisma.adminUser.findUnique({
    where: {
      id: adminId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!admin) {
    throw new AppError(404, "Admin not found");
  }

  if (!admin.isActive) {
    throw new AppError(403, "This admin account is inactive");
  }

  return admin;
};

export const AuthService = {
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  getCurrentAdmin
};