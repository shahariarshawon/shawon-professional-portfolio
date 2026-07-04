import multer from "multer";
import AppError from "../../errors/AppError";

const storage = multer.memoryStorage();

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml"
];

const allowedFileMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml"
];

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedImageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new AppError(400, "Only JPG, PNG, WEBP, and SVG images are allowed"));
};

const documentFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedFileMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new AppError(400, "Only PDF and image files are allowed"));
};

const uploadSingleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single("file");

const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
}).array("files", 10);

const uploadSingleFile = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
}).single("file");

export const UploadMiddleware = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleFile
};