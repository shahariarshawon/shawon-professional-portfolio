"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AdminCheckbox } from "@/components/admin/shared/admin-checkbox";
import { AdminFormCard } from "@/components/admin/shared/admin-form-card";
import { AdminInput } from "@/components/admin/shared/admin-input";
import { AdminTextarea } from "@/components/admin/shared/admin-textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  THeroUpdatePayload,
  updateAdminHero
} from "@/lib/admin-api";
import { getErrorMessage } from "@/lib/get-error-message";
import { uploadSingleFile, uploadSingleImage } from "@/lib/upload-api";
import { cn } from "@/lib/utils";
import { THeroSection } from "@/types/portfolio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getHeroFormDefaults } from "./hero-form-defaults";
import { heroFormSchema, THeroFormValues } from "./hero-schema";

type THeroFormProps = {
  hero: THeroSection | null | undefined;
};

export function HeroForm({ hero }: THeroFormProps) {
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<THeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: getHeroFormDefaults(hero)
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = form;

  const photoUrl = watch("photoUrl");
  const resumeUrl = watch("resumeUrl");

  const badgeFields = useFieldArray({
    control,
    name: "badges"
  });

  const techFields = useFieldArray({
    control,
    name: "techHighlights"
  });

  const socialFields = useFieldArray({
    control,
    name: "socialLinks"
  });

  const updateMutation = useMutation({
    mutationFn: (payload: THeroUpdatePayload) => updateAdminHero(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-hero"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-dashboard-overview"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["portfolio"]
        })
      ]);
    }
  });

  const photoUploadMutation = useMutation({
    mutationFn: (file: File) => uploadSingleImage(file, "images"),
    onSuccess: (result) => {
      if (result?.secureUrl) {
        setValue("photoUrl", result.secureUrl, {
          shouldDirty: true,
          shouldValidate: true
        });
      }
    }
  });

  const resumeUploadMutation = useMutation({
    mutationFn: (file: File) => uploadSingleFile(file, "resumes"),
    onSuccess: (result) => {
      if (result?.secureUrl) {
        setValue("resumeUrl", result.secureUrl, {
          shouldDirty: true,
          shouldValidate: true
        });
      }
    }
  });

  const onSubmit = (values: THeroFormValues) => {
    const payload: THeroUpdatePayload = {
      name: values.name,
      designation: values.designation,
      introduction: values.introduction,
      photoUrl: values.photoUrl || null,
      resumeUrl: values.resumeUrl || null,
      isGetInTouchEnabled: values.isGetInTouchEnabled,
      isViewResumeEnabled: values.isViewResumeEnabled,
      isDownloadResumeEnabled: values.isDownloadResumeEnabled,
      badges: values.badges.map((badge, index) => ({
        text: badge.text,
        order: Number(badge.order) || index + 1,
        isEnabled: badge.isEnabled
      })),
      techHighlights: values.techHighlights.map((tech, index) => ({
        name: tech.name,
        order: Number(tech.order) || index + 1,
        isEnabled: tech.isEnabled
      })),
      socialLinks: values.socialLinks.map((link, index) => ({
        platform: link.platform,
        url: link.url,
        icon: link.icon || null,
        order: Number(link.order) || index + 1,
        isEnabled: link.isEnabled
      }))
    };

    updateMutation.mutate(payload);
  };

  const handlePhotoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      photoUploadMutation.mutate(file);
    }

    event.target.value = "";
  };

  const handleResumeFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      resumeUploadMutation.mutate(file);
    }

    event.target.value = "";
  };

  const isSubmitting = updateMutation.isPending;
  const isPhotoUploading = photoUploadMutation.isPending;
  const isResumeUploading = resumeUploadMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <AdminFormCard
        title="Basic Hero Information"
        description="Update your name, professional title, and main introduction shown at the top of the portfolio."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <AdminInput
            label="Name"
            placeholder="AL Shahariar Arafat Shawon"
            error={errors.name?.message}
            {...register("name")}
          />

          <AdminInput
            label="Designation"
            placeholder="Backend Developer | Software Engineer"
            error={errors.designation?.message}
            {...register("designation")}
          />
        </div>

        <div className="mt-5">
          <AdminTextarea
            label="Introduction"
            rows={5}
            placeholder="Write a short professional introduction..."
            error={errors.introduction?.message}
            {...register("introduction")}
          />
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Photo and Resume"
        description="Upload a profile image and resume PDF. The uploaded URL will be saved into the Hero section."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="font-semibold text-highlight">Profile Photo</h3>

            <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-site bg-[var(--color-accent)]/10">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile photo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-normal">
                  <ImageUp size={36} />
                </div>
              )}
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoFileChange}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                disabled={isPhotoUploading}
              >
                {isPhotoUploading ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : (
                  <Upload className="mr-2" size={16} />
                )}
                Upload Photo
              </Button>
            </div>

            <div className="mt-4">
              <AdminInput
                label="Photo URL"
                placeholder="https://..."
                error={errors.photoUrl?.message}
                {...register("photoUrl")}
              />
            </div>

            {photoUploadMutation.error ? (
              <p className="mt-3 text-sm text-red-400">
                {getErrorMessage(photoUploadMutation.error)}
              </p>
            ) : null}
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-highlight">Resume PDF</h3>

            <div className="mt-4 rounded-2xl border border-site bg-[var(--color-background)]/40 p-5">
              <p className="text-sm text-normal">Current resume URL:</p>

              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm font-medium text-accent"
                >
                  {resumeUrl}
                </a>
              ) : (
                <p className="mt-2 text-sm text-normal">
                  No resume uploaded yet.
                </p>
              )}
            </div>

            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleResumeFileChange}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => resumeInputRef.current?.click()}
                disabled={isResumeUploading}
              >
                {isResumeUploading ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : (
                  <Upload className="mr-2" size={16} />
                )}
                Upload Resume
              </Button>
            </div>

            <div className="mt-4">
              <AdminInput
                label="Resume URL"
                placeholder="https://..."
                error={errors.resumeUrl?.message}
                {...register("resumeUrl")}
              />
            </div>

            {resumeUploadMutation.error ? (
              <p className="mt-3 text-sm text-red-400">
                {getErrorMessage(resumeUploadMutation.error)}
              </p>
            ) : null}
          </Card>
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Hero Buttons"
        description="Control which call-to-action buttons appear in the Hero section."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <AdminCheckbox
            label="Show Get in Touch"
            description="Displays the contact button."
            {...register("isGetInTouchEnabled")}
          />

          <AdminCheckbox
            label="Show View Resume"
            description="Displays the view resume button."
            {...register("isViewResumeEnabled")}
          />

          <AdminCheckbox
            label="Show Download Resume"
            description="Displays the download resume button."
            {...register("isDownloadResumeEnabled")}
          />
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Hero Badges"
        description="Small badges shown above the name in the Hero section."
      >
        <div className="space-y-4">
          {badgeFields.fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_120px_120px_auto] md:items-end">
                <AdminInput
                  label="Badge Text"
                  placeholder="Backend Developer"
                  error={errors.badges?.[index]?.text?.message}
                  {...register(`badges.${index}.text`)}
                />

                <AdminInput
                  label="Order"
                  type="number"
                  min={1}
                  error={errors.badges?.[index]?.order?.message}
                  {...register(`badges.${index}.order`)}
                />

                <AdminCheckbox
                  label="Enabled"
                  {...register(`badges.${index}.isEnabled`)}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => badgeFields.remove(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              badgeFields.append({
                text: "",
                order: badgeFields.fields.length + 1,
                isEnabled: true
              })
            }
          >
            <Plus className="mr-2" size={16} />
            Add Badge
          </Button>
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Tech Highlights"
        description="Technologies shown as quick highlights in the Hero section."
      >
        <div className="space-y-4">
          {techFields.fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_120px_120px_auto] md:items-end">
                <AdminInput
                  label="Technology"
                  placeholder="Node.js"
                  error={errors.techHighlights?.[index]?.name?.message}
                  {...register(`techHighlights.${index}.name`)}
                />

                <AdminInput
                  label="Order"
                  type="number"
                  min={1}
                  error={errors.techHighlights?.[index]?.order?.message}
                  {...register(`techHighlights.${index}.order`)}
                />

                <AdminCheckbox
                  label="Enabled"
                  {...register(`techHighlights.${index}.isEnabled`)}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => techFields.remove(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              techFields.append({
                name: "",
                order: techFields.fields.length + 1,
                isEnabled: true
              })
            }
          >
            <Plus className="mr-2" size={16} />
            Add Tech Highlight
          </Button>
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Social Links"
        description="Add GitHub, LinkedIn, portfolio, or other professional links."
      >
        <div className="space-y-4">
          {socialFields.fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminInput
                  label="Platform"
                  placeholder="GitHub"
                  error={errors.socialLinks?.[index]?.platform?.message}
                  {...register(`socialLinks.${index}.platform`)}
                />

                <AdminInput
                  label="URL"
                  placeholder="https://github.com/..."
                  error={errors.socialLinks?.[index]?.url?.message}
                  {...register(`socialLinks.${index}.url`)}
                />

                <AdminInput
                  label="Icon"
                  placeholder="Optional"
                  error={errors.socialLinks?.[index]?.icon?.message}
                  {...register(`socialLinks.${index}.icon`)}
                />

                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <AdminInput
                    label="Order"
                    type="number"
                    min={1}
                    error={errors.socialLinks?.[index]?.order?.message}
                    {...register(`socialLinks.${index}.order`)}
                  />

                  <AdminCheckbox
                    label="Enabled"
                    {...register(`socialLinks.${index}.isEnabled`)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => socialFields.remove(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              socialFields.append({
                platform: "",
                url: "",
                icon: "",
                order: socialFields.fields.length + 1,
                isEnabled: true
              })
            }
          >
            <Plus className="mr-2" size={16} />
            Add Social Link
          </Button>
        </div>
      </AdminFormCard>

      {updateMutation.error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {getErrorMessage(updateMutation.error)}
        </div>
      ) : null}

      {updateMutation.isSuccess ? (
        <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4 text-sm text-accent">
          Hero section updated successfully.
        </div>
      ) : null}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="rounded-full border border-site bg-[var(--color-background)]/90 p-2 shadow-lg backdrop-blur-xl">
          <Button
            type="submit"
            disabled={isSubmitting || isPhotoUploading || isResumeUploading}
            className={cn(!isDirty && "opacity-90")}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 animate-spin" size={17} />
            ) : (
              <Save className="mr-2" size={17} />
            )}
            Save Hero Section
          </Button>
        </div>
      </div>
    </form>
  );
}