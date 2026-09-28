import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Application } from "express";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { env } from "./config/env";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import sendResponse from "./utils/sendResponse";

const app: Application = express();
app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shawon Portfolio Server is running",
    data: {
      service: "shawon-portfolio-server",
      version: "1.0.0"
    }
  });
});

import { redisService } from "./common/redis/redis.service";

app.get("/healthz", (_req, res) => {
  const isRedisConnected = redisService.getClient()?.status === "ready";
  const isAiConfigured = !!env.geminiApiKey;
  
  res.status(200).json({
    status: "ok",
    redis: isRedisConnected ? "connected" : "disconnected",
    ai: isAiConfigured ? "available" : "unavailable"
  });
});

app.use("/api", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;