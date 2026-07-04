import { Router } from "express";
import healthRoutes from "./health.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/health",
    route: healthRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;