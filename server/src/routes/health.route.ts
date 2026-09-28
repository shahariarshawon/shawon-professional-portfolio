import { Router } from "express";
import { env } from "../config/env";
import sendResponse from "../utils/sendResponse";

const router = Router();

router.get("/", (_req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "API health check successful",
    data: {
      status: "healthy",
      environment: env.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

export default router;