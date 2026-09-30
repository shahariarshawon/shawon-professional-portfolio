import crypto from "crypto";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { JwtUtils } from "../../utils/jwt";
import { TAdminRole } from "../../types/auth";

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

const createRefreshToken = async (
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await prisma.refreshToken.create({
    data: {
      token,
      adminId,
      expiresAt,
      ipAddress,
      userAgent
    }
  });

  return {
    refreshToken: token,
    expiresAt
  };
};

const rotateRefreshToken = async (
  oldToken: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { admin: true }
  });

  if (!storedToken) {
    throw new AppError(401, "Invalid refresh token");
  }

  if (storedToken.revokedAt) {
    // Possible token reuse attack - revoke all refresh tokens for this admin
    await prisma.refreshToken.updateMany({
      where: { adminId: storedToken.adminId },
      data: { revokedAt: new Date() }
    });
    throw new AppError(401, "Compromised token detected. Please login again.");
  }

  if (new Date() > storedToken.expiresAt) {
    throw new AppError(401, "Refresh token has expired");
  }

  if (!storedToken.admin.isActive) {
    throw new AppError(403, "Admin account is inactive");
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() }
  });

  // Issue new tokens
  const newRefreshToken = await createRefreshToken(
    storedToken.adminId,
    ipAddress,
    userAgent
  );

  const accessToken = JwtUtils.createToken({
    adminId: storedToken.admin.id,
    email: storedToken.admin.email,
    role: storedToken.admin.role as TAdminRole
  });

  return {
    accessToken,
    refreshToken: newRefreshToken.refreshToken,
    admin: {
      id: storedToken.admin.id,
      name: storedToken.admin.name,
      email: storedToken.admin.email,
      role: storedToken.admin.role
    }
  };
};

const revokeRefreshToken = async (token: string) => {
  try {
    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() }
    });
  } catch {
    // Ignore if already deleted or doesn't exist
  }
};

const recordLogin = async (
  adminId: string,
  status: "SUCCESS" | "FAILED",
  ipAddress?: string,
  userAgent?: string,
  reason?: string
) => {
  try {
    await prisma.loginHistory.create({
      data: {
        adminId,
        status,
        ipAddress,
        userAgent,
        reason
      }
    });
  } catch (error) {
    console.error("Failed to record login history", error);
  }
};

export const RefreshTokenService = {
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  recordLogin
};
