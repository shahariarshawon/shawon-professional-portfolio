import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./auth.middleware";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.post(
  "/logout",
  AuthMiddleware.requireAuth(),
  AuthController.logout
);

router.get(
  "/me",
  AuthMiddleware.requireAuth(),
  AuthController.me
);

router.get(
  "/protected-test",
  AuthMiddleware.requireAuth(),
  AuthController.protectedTest
);

export default router;