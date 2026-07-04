import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import multer from "multer";
import { ZodError } from "zod";
import { env } from "../config/env";

type TErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorSources?: unknown;
  stack?: string;
};

type TCustomError = Error & {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
};

const globalErrorHandler = (
  err: TCustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorSources: unknown = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  }

  if (err instanceof multer.MulterError) {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Uploaded file is too large";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field";
    } else {
      message = err.message;
    }
  }

  if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  const response: TErrorResponse = {
    success: false,
    statusCode,
    message
  };

  if (errorSources) {
    response.errorSources = errorSources;
  }

  if (env.nodeEnv === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;