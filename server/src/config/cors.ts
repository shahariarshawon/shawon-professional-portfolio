import { CorsOptions } from "cors";
import { env } from "./env";

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://shahariararafat.vercel.app",
  "https://shahariarshawon.me",
  "https://www.shahariarshawon.me"
];

const envAllowedOrigins = env.clientUrl
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultAllowedOrigins, ...envAllowedOrigins])
);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const cleanOrigin = origin ? origin.replace(/\/+$/, "") : null;
    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true
};