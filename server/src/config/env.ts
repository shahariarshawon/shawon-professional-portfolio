import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  databaseUrl: process.env.DATABASE_URL || "",

  jwtSecret: process.env.JWT_SECRET || "temporary_secret_for_development",
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
  }
};