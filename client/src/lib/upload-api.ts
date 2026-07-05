import { api } from "@/lib/api";
import { TApiResponse } from "@/types/api";

export type TUploadResult = {
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

export type TUploadFolder =
  | "images"
  | "projects"
  | "resumes"
  | "certificates"
  | "skills"
  | "company-logos"
  | "about"
  | "others";

export const uploadSingleImage = async (
  file: File,
  folder: TUploadFolder = "images"
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<TApiResponse<TUploadResult>>(
    `/upload/image?folder=${folder}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data.data;
};

export const uploadSingleFile = async (
  file: File,
  folder: TUploadFolder = "others"
) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<TApiResponse<TUploadResult>>(
    `/upload/file?folder=${folder}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data.data;
};