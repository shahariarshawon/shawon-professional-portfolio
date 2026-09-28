import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { CompetitiveController } from "./competitive.controller";

const router = Router();

// Public route
router.get("/public", CompetitiveController.getStats);

// Admin route
router.use(AuthMiddleware.requireAuth());
router.post("/update", CompetitiveController.updateStats);

export default router;
