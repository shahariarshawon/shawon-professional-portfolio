import { CookieOptions } from "express";
import { env } from "../config/env";

const getAuthCookieOptions = (): CookieOptions => {
  const maxAge =
    env.authCookieMaxAgeDays * 24 * 60 * 60 * 1000;

  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge,
    path: "/"
  };
};

export const AuthCookieUtils = {
  getAuthCookieOptions
};