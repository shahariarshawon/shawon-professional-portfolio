import { Router } from "express";
import prisma from "../utils/prisma";
import sendResponse from "../utils/sendResponse";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.get(
  "/",
  catchAsync(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Database connection successful",
      data: {
        database: "PostgreSQL",
        orm: "Prisma",
        status: "connected"
      }
    });
  })
);

export default router;