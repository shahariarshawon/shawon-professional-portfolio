import { randomBytes } from "crypto";
import path from "path";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary";
import { isCloudinaryConfigured } from "../../config/env";
import AppError from "../../errors/AppError";
import {
  detectFileKind,
  isUnsafeSvg,
  TDetectedFileKind
} from "./upload.signature";

type TUploadFolder =
  | "images"
  | "projects"
  | "resumes"
  | "certificates"
  | "skills"
  | "company-logos"
  | "about"
  | "others";

type TUploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  originalFilename?: string;
};

type TCloudinaryError = {
  message?: string;
  http_code?: number;
  code?: string;
  name?: string;
};

const MAX_ATTEMPTS = 3;
const UPLOAD_TIMEOUT_MS = 60_000;
const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "svg"];

const IMAGE_KINDS: TDetectedFileKind[] = ["jpeg", "png", "webp", "svg"];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();

  readable.push(buffer);
  readable.push(null);

  return readable;
};

/**
 * Network blips, Cloudinary 5xx and rate limits (420/429) are worth retrying.
 * Anything else (bad credentials, invalid file) will fail the same way again.
 */
const isRetryable = (error: unknown) => {
  const { http_code: status, code, name } = (error ?? {}) as TCloudinaryError;

  if (status) return status >= 500 || status === 420 || status === 429;

  return (
    name === "TimeoutError" ||
    ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "EPIPE"].includes(code ?? "")
  );
};

const toAppError = (error: unknown) => {
  if (error instanceof AppError) return error;

  const { message, http_code: status } = (error ?? {}) as TCloudinaryError;

  if (status === 401 || status === 403) {
    return new AppError(
      502,
      "Cloudinary rejected the credentials. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  return new AppError(502, `Cloudinary upload failed: ${message || "unknown error"}`);
};

const assertCloudinaryReady = () => {
  if (!isCloudinaryConfigured()) {
    throw new AppError(
      503,
      "File storage is not configured on the server (missing Cloudinary credentials)."
    );
  }
};

const sanitizeBaseName = (originalName: string) => {
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return base || "file";
};

const uploadStreamOnce = (buffer: Buffer, options: UploadApiOptions) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new AppError(502, "Cloudinary returned an empty response"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.on("error", reject);
    bufferToStream(buffer).pipe(uploadStream);
  });

const uploadWithRetry = async (buffer: Buffer, options: UploadApiOptions) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await uploadStreamOnce(buffer, options);
    } catch (error) {
      lastError = error;

      if (attempt === MAX_ATTEMPTS || !isRetryable(error)) break;

      // 400ms, 1200ms: short enough for an interactive admin upload.
      await sleep(400 * 3 ** (attempt - 1));
    }
  }

  throw toAppError(lastError);
};

const toResult = (result: UploadApiResponse): TUploadResult => ({
  url: result.url,
  secureUrl: result.secure_url,
  publicId: result.public_id,
  resourceType: result.resource_type,
  format: result.format,
  bytes: result.bytes,
  width: result.width,
  height: result.height,
  originalFilename: result.original_filename
});

const uploadImageFile = async (
  file: Express.Multer.File,
  folder: TUploadFolder
) => {
  const kind = detectFileKind(file.buffer);

  if (!kind || !IMAGE_KINDS.includes(kind)) {
    throw new AppError(
      400,
      "The uploaded file is not a valid JPG, PNG, WEBP or SVG image."
    );
  }

  if (kind === "svg" && isUnsafeSvg(file.buffer)) {
    throw new AppError(400, "SVG files containing scripts are not allowed.");
  }

  const result = await uploadWithRetry(file.buffer, {
    folder: `shawon-portfolio/${folder}`,
    public_id: `${sanitizeBaseName(file.originalname)}-${randomBytes(4).toString("hex")}`,
    resource_type: "image",
    type: "upload",
    access_mode: "public",
    allowed_formats: IMAGE_FORMATS,
    timeout: UPLOAD_TIMEOUT_MS
  });

  return toResult(result);
};

/**
 * PDFs MUST be uploaded as `raw`. Uploaded as `image` (what `auto` picks for a
 * PDF) Cloudinary serves them from /image/upload/ where delivery of PDFs is
 * blocked by default, which surfaces as `401 deny or ACL failure`.
 * The `.pdf` extension stays in the public_id so the raw URL ends in .pdf and
 * is served as application/pdf.
 */
const uploadPdfFile = async (
  file: Express.Multer.File,
  folder: TUploadFolder
) => {
  const result = await uploadWithRetry(file.buffer, {
    folder: `shawon-portfolio/${folder}`,
    public_id: `${sanitizeBaseName(file.originalname)}-${randomBytes(4).toString("hex")}.pdf`,
    resource_type: "raw",
    type: "upload",
    access_mode: "public",
    timeout: UPLOAD_TIMEOUT_MS
  });

  return { ...toResult(result), format: "pdf" };
};

const uploadSingleImage = async (
  file: Express.Multer.File,
  folder: TUploadFolder = "images"
) => {
  if (!file) {
    throw new AppError(400, "No file uploaded");
  }

  assertCloudinaryReady();

  return uploadImageFile(file, folder);
};

const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: TUploadFolder = "projects"
) => {
  if (!files || !files.length) {
    throw new AppError(400, "No files uploaded");
  }

  assertCloudinaryReady();

  return Promise.all(files.map((file) => uploadImageFile(file, folder)));
};

const uploadSingleFile = async (
  file: Express.Multer.File,
  folder: TUploadFolder = "others"
) => {
  if (!file) {
    throw new AppError(400, "No file uploaded");
  }

  assertCloudinaryReady();

  const kind = detectFileKind(file.buffer);

  if (kind === "pdf") {
    return uploadPdfFile(file, folder);
  }

  if (kind && IMAGE_KINDS.includes(kind)) {
    return uploadImageFile(file, folder);
  }

  throw new AppError(400, "The uploaded file is not a valid PDF or image.");
};

export const UploadService = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleFile
};
