import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AchievementService } from "./achievement.service";
import AppError from "../../errors/AppError";

const getIdFromParams = (req: Request): string => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) throw new AppError(400, "Id is required");
  return id as string;
};

const getAchievements = catchAsync(async (_req: Request, res: Response) => {
  const result = await AchievementService.getAchievements();
  sendResponse(res, { success: true, statusCode: 200, message: "Achievements fetched successfully", data: result });
});

const createAchievement = catchAsync(async (req: Request, res: Response) => {
  const result = await AchievementService.createAchievement(req.body);
  sendResponse(res, { success: true, statusCode: 201, message: "Achievement created successfully", data: result });
});

const updateAchievement = catchAsync(async (req: Request, res: Response) => {
  const result = await AchievementService.updateAchievement(getIdFromParams(req), req.body);
  sendResponse(res, { success: true, statusCode: 200, message: "Achievement updated successfully", data: result });
});

const deleteAchievement = catchAsync(async (req: Request, res: Response) => {
  const result = await AchievementService.deleteAchievement(getIdFromParams(req));
  sendResponse(res, { success: true, statusCode: 200, message: "Achievement deleted successfully", data: result });
});

export const AchievementController = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
