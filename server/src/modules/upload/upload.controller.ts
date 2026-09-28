import { Request, Response } from "express";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UploadService } from "./upload.service";

type TUploadFolder =
  | "images"
  | "projects"
  | "resumes"
  | "certificates"
  | "skills"
  | "company-logos"
  | "about"
  | "others";

const getFolderFromQuery = (req: Request, defaultFolder: TUploadFolder) => {
  const folderQuery = req.query.folder;

  if (typeof folderQuery !== "string") {
    return defaultFolder;
  }

  const allowedFolders: TUploadFolder[] = [
    "images",
    "projects",
    "resumes",
    "certificates",
    "skills",
    "company-logos",
    "about",
    "others"
  ];

  if (!allowedFolders.includes(folderQuery as TUploadFolder)) {
    return defaultFolder;
  }

  return folderQuery as TUploadFolder;
};

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, "No image uploaded");
  }

  const folder = getFolderFromQuery(req, "images");

  const result = await UploadService.uploadSingleImage(req.file, folder);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Image uploaded successfully",
    data: result
  });
});

const uploadImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || !files.length) {
    throw new AppError(400, "No images uploaded");
  }

  const folder = getFolderFromQuery(req, "projects");

  const result = await UploadService.uploadMultipleImages(files, folder);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Images uploaded successfully",
    data: result
  });
});

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, "No file uploaded");
  }

  const folder = getFolderFromQuery(req, "others");

  const result = await UploadService.uploadSingleFile(req.file, folder);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "File uploaded successfully",
    data: result
  });
});

export const UploadController = {
  uploadImage,
  uploadImages,
  uploadFile
};