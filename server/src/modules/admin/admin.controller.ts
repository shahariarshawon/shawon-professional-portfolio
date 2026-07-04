import { Request, Response } from "express";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getIdFromParams = (req: Request) => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    throw new AppError(400, "Id is required");
  }

  return id;
};

/* ---------------- Dashboard ---------------- */

const getDashboardOverview = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getDashboardOverview();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard overview fetched successfully",
    data: result
  });
});

/* ---------------- Hero ---------------- */

const getHero = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getHero();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Hero section fetched successfully",
    data: result
  });
});

const updateHero = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateHero(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Hero section updated successfully",
    data: result
  });
});

/* ---------------- About ---------------- */

const getAbout = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getAbout();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "About section fetched successfully",
    data: result
  });
});

const updateAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateAbout(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "About section updated successfully",
    data: result
  });
});

/* ---------------- Navbar ---------------- */

const getNavbarItems = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getNavbarItems();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Navbar items fetched successfully",
    data: result
  });
});

const createNavbarItem = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createNavbarItem(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Navbar item created successfully",
    data: result
  });
});

const updateNavbarItem = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Navbar item", () =>
    AdminService.updateNavbarItem(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Navbar item updated successfully",
    data: result
  });
});

const deleteNavbarItem = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Navbar item", () =>
    AdminService.deleteNavbarItem(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Navbar item deleted successfully",
    data: result
  });
});

/* ---------------- Experience ---------------- */

const getExperiences = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getExperiences();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Experiences fetched successfully",
    data: result
  });
});

const createExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createExperience(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Experience created successfully",
    data: result
  });
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Experience", () =>
    AdminService.updateExperience(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Experience updated successfully",
    data: result
  });
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Experience", () =>
    AdminService.deleteExperience(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Experience deleted successfully",
    data: result
  });
});

/* ---------------- Skill Categories ---------------- */

const getSkillCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getSkillCategories();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skill categories fetched successfully",
    data: result
  });
});

const createSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createSkillCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Skill category created successfully",
    data: result
  });
});

const updateSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Skill category", () =>
    AdminService.updateSkillCategory(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skill category updated successfully",
    data: result
  });
});

const deleteSkillCategory = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Skill category", () =>
    AdminService.deleteSkillCategory(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skill category deleted successfully",
    data: result
  });
});

/* ---------------- Skills ---------------- */

const getSkills = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getSkills();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skills fetched successfully",
    data: result
  });
});

const createSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createSkill(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Skill created successfully",
    data: result
  });
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Skill", () =>
    AdminService.updateSkill(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skill updated successfully",
    data: result
  });
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Skill", () =>
    AdminService.deleteSkill(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skill deleted successfully",
    data: result
  });
});

/* ---------------- Projects ---------------- */

const getProjects = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getProjects();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Projects fetched successfully",
    data: result
  });
});

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createProject(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Project created successfully",
    data: result
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Project", () =>
    AdminService.updateProject(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Project updated successfully",
    data: result
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Project", () =>
    AdminService.deleteProject(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Project deleted successfully",
    data: result
  });
});

/* ---------------- Education ---------------- */

const getEducation = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getEducation();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Education records fetched successfully",
    data: result
  });
});

const createEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createEducation(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Education record created successfully",
    data: result
  });
});

const updateEducation = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Education", () =>
    AdminService.updateEducation(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Education record updated successfully",
    data: result
  });
});

const deleteEducation = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Education", () =>
    AdminService.deleteEducation(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Education record deleted successfully",
    data: result
  });
});

/* ---------------- Certifications ---------------- */

const getCertifications = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getCertifications();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Certifications fetched successfully",
    data: result
  });
});

const createCertification = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createCertification(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Certification created successfully",
    data: result
  });
});

const updateCertification = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Certification", () =>
    AdminService.updateCertification(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Certification updated successfully",
    data: result
  });
});

const deleteCertification = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Certification", () =>
    AdminService.deleteCertification(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Certification deleted successfully",
    data: result
  });
});

/* ---------------- Services ---------------- */

const getServices = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getServices();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Services fetched successfully",
    data: result
  });
});

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Service created successfully",
    data: result
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Service", () =>
    AdminService.updateService(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service updated successfully",
    data: result
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Service", () =>
    AdminService.deleteService(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service deleted successfully",
    data: result
  });
});

/* ---------------- Contact Info and Messages ---------------- */

const getContactInfo = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getContactInfo();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Contact info fetched successfully",
    data: result
  });
});

const updateContactInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateContactInfo(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Contact info updated successfully",
    data: result
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const statusQuery = req.query.status;
  const status = typeof statusQuery === "string" ? statusQuery : undefined;

  const result = await AdminService.getMessages(status);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Contact messages fetched successfully",
    data: result
  });
});

const markMessageAsRead = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Message", () =>
    AdminService.markMessageAsRead(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message marked as read successfully",
    data: result
  });
});

const markMessageAsUnread = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Message", () =>
    AdminService.markMessageAsUnread(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message marked as unread successfully",
    data: result
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Message", () =>
    AdminService.deleteMessage(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Message deleted successfully",
    data: result
  });
});

/* ---------------- Footer Links ---------------- */

const getFooterLinks = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getFooterLinks();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Footer links fetched successfully",
    data: result
  });
});

const createFooterLink = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createFooterLink(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Footer link created successfully",
    data: result
  });
});

const updateFooterLink = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Footer link", () =>
    AdminService.updateFooterLink(id, req.body)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Footer link updated successfully",
    data: result
  });
});

const deleteFooterLink = catchAsync(async (req: Request, res: Response) => {
  const id = getIdFromParams(req);

  const result = await AdminService.ensureRecordExists("Footer link", () =>
    AdminService.deleteFooterLink(id)
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Footer link deleted successfully",
    data: result
  });
});

/* ---------------- Site Settings ---------------- */

const getSiteSettings = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getSiteSettings();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Site settings fetched successfully",
    data: result
  });
});

const updateSiteSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateSiteSettings(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Site settings updated successfully",
    data: result
  });
});

export const AdminController = {
  getDashboardOverview,

  getHero,
  updateHero,

  getAbout,
  updateAbout,

  getNavbarItems,
  createNavbarItem,
  updateNavbarItem,
  deleteNavbarItem,

  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,

  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,

  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,

  getProjects,
  createProject,
  updateProject,
  deleteProject,

  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,

  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,

  getServices,
  createService,
  updateService,
  deleteService,

  getContactInfo,
  updateContactInfo,

  getMessages,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,

  getFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,

  getSiteSettings,
  updateSiteSettings
};