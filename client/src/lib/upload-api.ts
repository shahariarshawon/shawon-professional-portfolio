import axios from "axios";

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

const MAX_ATTEMPTS = 3;
// Large files on slow links, plus a possible cold-starting backend.
const UPLOAD_TIMEOUT_MS = 90_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Network failures, timeouts and gateway errors are transient; 4xx never are. */
const isTransient = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;
  if (!error.response) return true;

  return [500, 502, 503, 504].includes(error.response.status);
};

async function upload(endpoint: "image" | "file", file: File, folder: TUploadFolder) {
  for (let attempt = 1; ; attempt++) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post<TApiResponse<TUploadResult>>(
        `/upload/${endpoint}?folder=${folder}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: UPLOAD_TIMEOUT_MS
        }
      );

      return res.data.data;
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isTransient(error)) throw error;

      await sleep(1000 * attempt);
    }
  }
}

export const uploadSingleImage = (file: File, folder: TUploadFolder = "images") =>
  upload("image", file, folder);

export const uploadSingleFile = (file: File, folder: TUploadFolder = "others") =>
  upload("file", file, folder);
