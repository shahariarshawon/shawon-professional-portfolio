import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";
import { JwtUtils } from "../../utils/jwt";
import { PasswordUtils } from "../../utils/password";

type TLoginPayload = {
  email: string;
  password: string;
};

const loginAdmin = async (payload: TLoginPayload) => {
  const admin = await prisma.adminUser.findUnique({
    where: {
      email: payload.email
    }
  });

  if (!admin) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new AppError(403, "This admin account is inactive");
  }

  const isPasswordMatched = await PasswordUtils.comparePassword(
    payload.password,
    admin.password
  );

  if (!isPasswordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = JwtUtils.createToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role
  });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  };
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
  getCurrentAdmin
};