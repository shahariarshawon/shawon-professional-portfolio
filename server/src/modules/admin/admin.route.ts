import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthMiddleware } from "../auth/auth.middleware";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

router.use(AuthMiddleware.requireAuth());

router.get("/dashboard", AdminController.getDashboardOverview);

/* Hero */
router.get("/hero", AdminController.getHero);
router.patch(
  "/hero",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.updateHero
);

/* About */
router.get("/about", AdminController.getAbout);
router.patch(
  "/about",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.updateAbout
);

/* Navbar */
router.get("/navbar", AdminController.getNavbarItems);
router.post(
  "/navbar",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createNavbarItem
);
router.patch(
  "/navbar/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateNavbarItem
);
router.delete(
  "/navbar/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteNavbarItem
);

/* Experience */
router.get("/experience", AdminController.getExperiences);
router.post(
  "/experience",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createExperience
);
router.patch(
  "/experience/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateExperience
);
router.delete(
  "/experience/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteExperience
);

/* Skill Categories */
router.get("/skill-categories", AdminController.getSkillCategories);
router.post(
  "/skill-categories",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createSkillCategory
);
router.patch(
  "/skill-categories/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateSkillCategory
);
router.delete(
  "/skill-categories/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteSkillCategory
);

/* Skills */
router.get("/skills", AdminController.getSkills);
router.post(
  "/skills",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createSkill
);
router.patch(
  "/skills/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateSkill
);
router.delete(
  "/skills/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteSkill
);

/* Projects */
router.get("/projects", AdminController.getProjects);
router.post(
  "/projects",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createProject
);
router.patch(
  "/projects/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateProject
);
router.delete(
  "/projects/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteProject
);

/* Education */
router.get("/education", AdminController.getEducation);
router.post(
  "/education",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createEducation
);
router.patch(
  "/education/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateEducation
);
router.delete(
  "/education/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteEducation
);

/* Certifications */
router.get("/certifications", AdminController.getCertifications);
router.post(
  "/certifications",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createCertification
);
router.patch(
  "/certifications/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateCertification
);
router.delete(
  "/certifications/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteCertification
);

/* Services */
router.get("/services", AdminController.getServices);
router.post(
  "/services",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createService
);
router.patch(
  "/services/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateService
);
router.delete(
  "/services/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteService
);

/* Contact Info */
router.get("/contact-info", AdminController.getContactInfo);
router.patch(
  "/contact-info",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.updateContactInfo
);

/* Contact Messages */
router.get("/messages", AdminController.getMessages);
router.patch(
  "/messages/:id/read",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.markMessageAsRead
);
router.patch(
  "/messages/:id/unread",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.markMessageAsUnread
);
router.delete(
  "/messages/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteMessage
);

/* Footer Links */
router.get("/footer-links", AdminController.getFooterLinks);
router.post(
  "/footer-links",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.createFooterLink
);
router.patch(
  "/footer-links/:id",
  validateRequest(AdminValidation.bodyWithIdParamValidationSchema),
  AdminController.updateFooterLink
);
router.delete(
  "/footer-links/:id",
  validateRequest(AdminValidation.idParamValidationSchema),
  AdminController.deleteFooterLink
);

/* Site Settings */
router.get("/site-settings", AdminController.getSiteSettings);
router.patch(
  "/site-settings",
  validateRequest(AdminValidation.bodyValidationSchema),
  AdminController.updateSiteSettings
);

export default router;