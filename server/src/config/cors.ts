import { CorsOptions } from "cors";
import { env } from "./env";

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");

/** CLIENT_URL may hold several comma-separated origins (prod + previews). */
export const allowedOrigins = env.clientUrl
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Server-to-server calls (Next.js SSR, health checks, curl) send no Origin.
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    // Reject without throwing: the browser blocks the response, while the API
    // doesn't turn every stray origin into a logged 500.
    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
};
