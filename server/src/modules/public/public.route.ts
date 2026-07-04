import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PublicController } from "./public.controller";
import { PublicValidation } from "./public.validation";

const router = Router();

router.get("/portfolio", PublicController.getFullPortfolio);

router.get("/navbar", PublicController.getNavbar);

router.get("/hero", PublicController.getHero);

router.get("/about", PublicController.getAbout);

router.get("/experience", PublicController.getExperiences);

router.get("/skills", PublicController.getSkills);

router.get("/projects", PublicController.getProjects);

router.get(
  "/projects/:slug",
  validateRequest(PublicValidation.projectSlugValidationSchema),
  PublicController.getProjectBySlug
);

router.get("/education", PublicController.getEducation);

router.get("/certifications", PublicController.getCertifications);

router.get("/services", PublicController.getServices);

router.get("/contact-info", PublicController.getContactInfo);

router.get("/footer", PublicController.getFooter);

router.get("/site-settings", PublicController.getSiteSettings);

export default router;