import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AnalyticsService } from "./analytics.service";

const trackEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventType, page, visitorId, metadata } = req.body;
  const result = await AnalyticsService.trackEvent(eventType, page, visitorId, metadata);
  sendResponse(res, { success: true, statusCode: 201, message: "Event tracked", data: result });
});

const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const result = await AnalyticsService.getAnalyticsOverview();
  sendResponse(res, { success: true, statusCode: 200, message: "Analytics overview fetched", data: result });
});

const getRecentVisitors = catchAsync(async (_req: Request, res: Response) => {
  const result = await AnalyticsService.getRecentVisitors();
  sendResponse(res, { success: true, statusCode: 200, message: "Recent visitors fetched", data: result });
});

export const AnalyticsController = {
  trackEvent,
  getOverview,
  getRecentVisitors
};
