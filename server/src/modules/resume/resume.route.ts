import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";
import { ResumeController } from "./resume.controller";
import { ResumeValidation } from "./resume.validation";

const router = Router();

router.get("/", ResumeController.getResumeForAdmin);

router.patch(
  "/",
  validateRequest(ResumeValidation.updateResumeValidationSchema),
  ResumeController.updateActiveResume
);

export default router;