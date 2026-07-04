import { Router } from "express";
import databaseRoutes from "./database.route";
import healthRoutes from "./health.route";
import authRoutes from "../modules/auth/auth.route";
import publicRoutes from "../modules/public/public.route";
import adminRoutes from "../modules/admin/admin.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
