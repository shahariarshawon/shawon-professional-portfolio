import { Router } from "express";
import rateLimit from "express-rate-limit";

import validateRequest from "../../middlewares/validateRequest";
import { ContactController } from "./contact.controller";
import { ContactValidation } from "./contact.validation";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many contact requests. Please try again later."
  }
});

router.post(
  "/",
  contactLimiter,
  validateRequest(ContactValidation.createContactMessageValidationSchema),
  ContactController.createContactMessage
);

export default router;