import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ResumeService } from "./resume.service";

const getResumeForAdmin = catchAsync(async (_req: Request, res: Response) => {
  const result = await ResumeService.getResumeForAdmin();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Resume retrieved successfully",
    data: result
  });
});

const updateActiveResume = catchAsync(async (req: Request, res: Response) => {
  const result = await ResumeService.updateActiveResume(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Resume updated successfully",
    data: result
  });
});

export const ResumeController = {
  getResumeForAdmin,
  updateActiveResume
};