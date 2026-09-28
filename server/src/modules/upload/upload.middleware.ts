import path from "path";
import multer from "multer";
import AppError from "../../errors/AppError";

const storage = multer.memoryStorage();

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/pjpeg",
  "image/x-png",
  "application/octet-stream"
];

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

const allowedFileMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/pjpeg",
  "image/x-png",
  "application/octet-stream"
];

const allowedFileExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg"
];

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isAllowedMime = allowedImageMimeTypes.includes(file.mimetype);
  const isAllowedExt = allowedImageExtensions.includes(ext);

  if (isAllowedMime && isAllowedExt) {
    cb(null, true);
    return;
  }

  cb(
    new AppError(
      400,
      `Only JPG, JPEG, PNG, WEBP, and SVG images are allowed. Received mimetype: ${file.mimetype}, extension: ${ext}`
    )
  );
};

const documentFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isAllowedMime = allowedFileMimeTypes.includes(file.mimetype);
  const isAllowedExt = allowedFileExtensions.includes(ext);

  if (isAllowedMime && isAllowedExt) {
    cb(null, true);
    return;
  }

  cb(
    new AppError(
      400,
      `Only PDF and image files are allowed. Received mimetype: ${file.mimetype}, extension: ${ext}`
    )
  );
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