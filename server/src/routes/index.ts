import { Router } from "express";
import databaseRoutes from "./database.route";
import healthRoutes from "./health.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/health",
    route: healthRoutes
  },
  {
    path: "/database",
    route: databaseRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;