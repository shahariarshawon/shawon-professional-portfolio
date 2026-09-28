import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { AIController } from "./ai.controller";

const router = Router();

// Public route for portfolio assistant
router.post("/ask", AIController.ask);

// Admin AI Support Routes
router.use(AuthMiddleware.requireAuth());
router.post("/generate-summary", AIController.generateSummary);
router.post("/suggest-title", AIController.suggestTitle);

export default router;
