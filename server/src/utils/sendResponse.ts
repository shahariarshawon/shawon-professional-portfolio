import { Response } from "express";
import { TApiResponse } from "../types/apiResponse";

const sendResponse = <T>(res: Response, payload: TApiResponse<T>) => {
  const responseData: TApiResponse<T> = {
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message
  };

  if (payload.data !== undefined) {
    responseData.data = payload.data;
  }

  if (payload.meta !== undefined) {
    responseData.meta = payload.meta;
  }

  res.status(payload.statusCode).json(responseData);
};

export default sendResponse;