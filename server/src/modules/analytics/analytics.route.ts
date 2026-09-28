import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { AnalyticsController } from "./analytics.controller";

const router = Router();

// Public route for tracking
router.post("/track", AnalyticsController.trackEvent);

// Admin routes
router.use(AuthMiddleware.requireAuth());
router.get("/overview", AnalyticsController.getOverview);
router.get("/visitors", AnalyticsController.getRecentVisitors);

export default router;
