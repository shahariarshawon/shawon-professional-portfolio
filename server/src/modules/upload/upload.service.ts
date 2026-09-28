import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import cloudinary from "../../config/cloudinary";
import AppError from "../../errors/AppError";

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

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();

  readable.push(buffer);
  readable.push(null);

  return readable;
};

const uploadBufferToCloudinary = async (
  file: Express.Multer.File,
  folder: TUploadFolder = "others",
  resourceType: "image" | "raw" | "auto" = "auto"
): Promise<TUploadResult> => {
  if (!file) {
    throw new AppError(400, "No file uploaded");
  }

  const uploadFolder = `shawon-portfolio/${folder}`;

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: uploadFolder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new AppError(500, "Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    originalFilename: result.original_filename
  };
};

const uploadSingleImage = async (
  file: Express.Multer.File,
  folder: TUploadFolder = "images"
) => {
  return uploadBufferToCloudinary(file, folder, "image");
};

const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: TUploadFolder = "projects"
) => {
  if (!files || !files.length) {
    throw new AppError(400, "No files uploaded");
  }

  const uploadedFiles = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file, folder, "image"))
  );

  return uploadedFiles;
};

const uploadSingleFile = async (
  file: Express.Multer.File,
  folder: TUploadFolder = "others"
) => {
  return uploadBufferToCloudinary(file, folder, "auto");
};

export const UploadService = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleFile
};