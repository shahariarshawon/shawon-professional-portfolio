import { Router } from "express";
import databaseRoutes from "./database.route";
import healthRoutes from "./health.route";
import authRoutes from "../modules/auth/auth.route";
import publicRoutes from "../modules/public/public.route";
import adminRoutes from "../modules/admin/admin.route";
import uploadRoutes from "../modules/upload/upload.route";
import contactRoutes from "../modules/contact/contact.route";
import sendResponse from "../utils/sendResponse";

const router = Router();

router.get("/", (_req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shawon Portfolio API is running",
    data: {
      status: "healthy",
      version: "1.0.0"
    }
  });
});

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
