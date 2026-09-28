import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CompetitiveService } from "./competitive.service";
import AppError from "../../errors/AppError";

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await CompetitiveService.getCompetitiveStats();
  sendResponse(res, { success: true, statusCode: 200, message: "Stats fetched", data: result });
});

const updateStats = catchAsync(async (req: Request, res: Response) => {
  const { platform } = req.body;
  if (!platform) throw new AppError(400, "Platform is required");

  const result = await CompetitiveService.updateStats(platform, req.body);
  sendResponse(res, { success: true, statusCode: 200, message: "Stats updated", data: result });
});

export const CompetitiveController = {
  getStats,
  updateStats
};
