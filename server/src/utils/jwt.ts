import { AdminRole } from "@prisma/client";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type TAuthTokenPayload = {
  adminId: string;
  email: string;
  role: AdminRole;
};

const createToken = (payload: TAuthTokenPayload) => {
  const expiresIn = env.jwtExpiresIn as SignOptions["expiresIn"];

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as TAuthTokenPayload & JwtPayload;
};

export const JwtUtils = {
  createToken,
  verifyToken
};