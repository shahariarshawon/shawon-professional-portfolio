import "dotenv/config";

const DEV_JWT_SECRET = "temporary_secret_for_development";

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,

  databaseUrl: process.env.DATABASE_URL || "",

  jwtSecret: process.env.JWT_SECRET || DEV_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  authCookieName: process.env.AUTH_COOKIE_NAME || "shawon_admin_token",
  authCookieMaxAgeDays: Number(process.env.AUTH_COOKIE_MAX_AGE_DAYS) || 7,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || ""
  },

  email: {
    from: process.env.EMAIL_FROM || "",
    to: process.env.EMAIL_TO || "shahariarshawon.dev@gmail.com",
    resendApiKey: process.env.RESEND_API_KEY || ""
  },

  redisUrl: process.env.REDIS_URL || "",
  geminiApiKey: process.env.GEMINI_API_KEY || ""
};

export const isCloudinaryConfigured = () =>
  Boolean(
    env.cloudinary.cloudName &&
      env.cloudinary.apiKey &&
      env.cloudinary.apiSecret
  );

/**
 * Fail fast on settings that would make a production deploy insecure or
 * silently broken, and warn about optional integrations that are missing.
 */
export const assertProductionEnv = () => {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (isProduction && env.jwtSecret === DEV_JWT_SECRET) {
    throw new Error(
      "JWT_SECRET must be set to a strong random value in production"
    );
  }

  if (isProduction && /localhost|127\.0\.0\.1/.test(env.clientUrl)) {
    console.warn(
      "[env] CLIENT_URL points at localhost; set it to your Vercel URL or CORS will block the site."
    );
  }

  if (!isCloudinaryConfigured()) {
    console.warn(
      "[env] Cloudinary credentials are missing: image/resume uploads and the resume endpoint are disabled."
    );
  }
};
