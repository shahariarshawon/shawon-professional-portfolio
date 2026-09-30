"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, FileText } from "lucide-react";
import { uploadSingleImage, uploadSingleFile, TUploadFolder } from "@/lib/upload-api";

type MediaUploaderProps = {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: TUploadFolder;
  label?: string;
  description?: string;
  accept?: string;
  isPdf?: boolean;
};

export function MediaUploader({
  value,
  onChange,
  folder = "images",
  label = "Upload Media",
  description = "PNG, JPG, WebP up to 5MB",
  accept = "image/*",
  isPdf = false
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const result = isPdf
        ? await uploadSingleFile(file, folder)
        : await uploadSingleImage(file, folder);

      if (result?.secureUrl || result?.url) {
        onChange(result.secureUrl || result.url);
      }
    } catch (err: any) {
      console.error("Upload error", err);
      setErrorMessage(err?.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl("");
      setIsUrlMode(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-highlight">{label}</label>
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-[11px] text-accent hover:underline flex items-center gap-1"
          >
            <LinkIcon size={12} />
            {isUrlMode ? "Upload File" : "Paste URL"}
          </button>
        </div>
      )}

      {isUrlMode ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.png"
            className="flex-1 rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="rounded-xl bg-(--color-accent) px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>
      ) : null}

      {value ? (
        <div className="relative flex items-center gap-4 rounded-2xl border border-site bg-(--color-background)/40 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-site bg-card flex items-center justify-center">
            {isPdf || value.endsWith(".pdf") ? (
              <FileText size={28} className="text-accent" />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <p className="truncate text-xs font-medium text-highlight">{value}</p>
            <p className="text-[11px] text-normal mt-0.5">Media attached</p>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 rounded-lg p-1 text-normal hover:bg-white/10 hover:text-red-400 transition"
            title="Remove media"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-site bg-(--color-background)/30 p-6 text-center transition hover:border-(--color-accent)/60 hover:bg-(--color-accent)/5"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-accent" />
              <p className="text-xs text-normal">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-accent)/10 text-accent group-hover:scale-105 transition">
                {isPdf ? <FileText size={20} /> : <Upload size={20} />}
              </div>
              <div>
                <p className="text-xs font-medium text-highlight">
                  Click to upload or drag and drop
                </p>
                <p className="text-[11px] text-normal mt-0.5">{description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
