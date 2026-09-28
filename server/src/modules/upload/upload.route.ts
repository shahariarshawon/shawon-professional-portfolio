import { Router } from "express";
import { AuthMiddleware } from "../auth/auth.middleware";
import { UploadController } from "./upload.controller";
import { UploadMiddleware } from "./upload.middleware";

const router = Router();

router.use(AuthMiddleware.requireAuth());

router.post(
  "/image",
  UploadMiddleware.uploadSingleImage,
  UploadController.uploadImage
);

router.post(
  "/images",
  UploadMiddleware.uploadMultipleImages,
  UploadController.uploadImages
);

router.post(
  "/file",
  UploadMiddleware.uploadSingleFile,
  UploadController.uploadFile
);

export default router;