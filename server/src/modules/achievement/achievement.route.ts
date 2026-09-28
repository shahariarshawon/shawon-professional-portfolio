import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { AchievementController } from "./achievement.controller";

const router = Router();

// Public routes
router.get("/public", AchievementController.getAchievements);

// Admin routes
router.use(AuthMiddleware.requireAuth());
router.get("/", AchievementController.getAchievements);
router.post("/", AchievementController.createAchievement);
router.patch("/:id", AchievementController.updateAchievement);
router.delete("/:id", AchievementController.deleteAchievement);

export default router;
