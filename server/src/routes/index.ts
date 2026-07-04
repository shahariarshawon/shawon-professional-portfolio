import { Router } from "express";
import databaseRoutes from "./database.route";
import healthRoutes from "./health.route";
import authRoutes from "../modules/auth/auth.route"

const router = Router();

const moduleRoutes = [
  {
    path: "/health",
    route: healthRoutes
  },
  {
    path: "/database",
    route: databaseRoutes
  },
  {
    path:"/auth",
    route: authRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;