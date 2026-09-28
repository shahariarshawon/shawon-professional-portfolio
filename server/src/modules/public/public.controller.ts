import { Request, Response } from "express";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PublicService } from "./public.service";

const getNavbar = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getNavbar();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Navbar data fetched successfully",
    data: result
  });
});

const getHero = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getHero();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Hero section fetched successfully",
    data: result
  });
});

const getAbout = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getAbout();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "About section fetched successfully",
    data: result
  });
});

const getExperiences = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getExperiences();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Experience data fetched successfully",
    data: result
  });
});

const getSkills = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getSkills();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skills data fetched successfully",
    data: result
  });
});

const getProjects = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getProjects();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Projects fetched successfully",
    data: result
  });
});

const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
  const slugParam = req.params.slug;

  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  if (!slug) {
    throw new AppError(400, "Project slug is required");
  }

  const result = await PublicService.getProjectBySlug(slug);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Project details fetched successfully",
    data: result
  });
});

const getEducation = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getEducation();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Education data fetched successfully",
    data: result
  });
});

const getCertifications = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getCertifications();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Certifications fetched successfully",
    data: result
  });
});

const getServices = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getServices();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Services fetched successfully",
    data: result
  });
});

const getContactInfo = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getContactInfo();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Contact information fetched successfully",
    data: result
  });
});

const getFooter = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getFooter();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Footer data fetched successfully",
    data: result
  });
});

const getSiteSettings = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getSiteSettings();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Site settings fetched successfully",
    data: result
  });
});

const getFullPortfolio = catchAsync(async (_req: Request, res: Response) => {
  const result = await PublicService.getFullPortfolio();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Full portfolio data fetched successfully",
    data: result
  });
});

export const PublicController = {
  getNavbar,
  getHero,
  getAbout,
  getExperiences,
  getSkills,
  getProjects,
  getProjectBySlug,
  getEducation,
  getCertifications,
  getServices,
  getContactInfo,
  getFooter,
  getSiteSettings,
  getFullPortfolio
};