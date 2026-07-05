import { CookieOptions, Response } from "express";

import { env } from "../config/env";

export const getAuthCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: env.authCookieMaxAgeDays * 24 * 60 * 60 * 1000,
    path: "/"
  };
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(env.authCookieName, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(env.authCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    path: "/"
  });
};