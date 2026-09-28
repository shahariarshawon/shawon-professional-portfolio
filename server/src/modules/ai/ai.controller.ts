import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { askAssistant, generateBlogSummary, suggestSEOTitle } from "./chat.service";

const ask = catchAsync(async (req: Request, res: Response) => {
  const { sessionId, query } = req.body;
  const result = await askAssistant(sessionId || "anonymous", query);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "AI response generated",
    data: { response: result }
  });
});

const generateSummary = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const result = await generateBlogSummary(content);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Summary generated",
    data: { summary: result }
  });
});

const suggestTitle = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const result = await suggestSEOTitle(content);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Title suggested",
    data: { title: result }
  });
});

export const AIController = {
  ask,
  generateSummary,
  suggestTitle
};
