import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactService } from "./contact.service";

const createContactMessage = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ContactService.createContactMessage(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Message sent successfully",
      data: result
        ? {
            id: result.id,
            status: result.status,
            createdAt: result.createdAt
          }
        : null
    });
  }
);

export const ContactController = {
  createContactMessage
};