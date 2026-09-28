import { Router } from "express";
import databaseRoutes from "./database.route";
import healthRoutes from "./health.route";
import authRoutes from "../modules/auth/auth.route";
import publicRoutes from "../modules/public/public.route";
import adminRoutes from "../modules/admin/admin.route";
import uploadRoutes from "../modules/upload/upload.route";
import contactRoutes from "../modules/contact/contact.route";
import blogRoutes from "../modules/blog/blog.route";
import achievementRoutes from "../modules/achievement/achievement.route";
import aiRoutes from "../modules/ai/ai.route";
import analyticsRoutes from "../modules/analytics/analytics.route";
import competitiveRoutes from "../modules/competitive/competitive.route";
import { PublicApiRouter } from "../modules/public-api/public.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/health",
    route: healthRoutes,
  },
  {
    path: "/database",
    route: databaseRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/public",
    route: publicRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/blogs",
    route: blogRoutes,
  },
  {
    path: "/achievements",
    route: achievementRoutes,
  },
  {
    path: "/ai",
    route: aiRoutes,
  },
  {
    path: "/analytics",
    route: analyticsRoutes,
  },
  {
    path: "/competitive",
    route: competitiveRoutes,
  },
  {
    path: "/v1",
    route: PublicApiRouter,
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
