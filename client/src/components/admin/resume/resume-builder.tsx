"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AdminCheckbox } from "@/components/admin/shared/admin-checkbox";
import { AdminFormCard } from "@/components/admin/shared/admin-form-card";
import { AdminInput } from "@/components/admin/shared/admin-input";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { AdminTextarea } from "@/components/admin/shared/admin-textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/get-error-message";
import { updateAdminResume } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { TResume, TResumeUpdatePayload } from "@/types/resume";
import { getResumeFormDefaults } from "./resume-form-defaults";
import { ResumePreview } from "./resume-preview";
import { resumeFormSchema, TResumeFormValues } from "./resume-schema";
import { splitCommaText } from "./resume-utils";

type TResumeBuilderProps = {
  resume: TResume | null | undefined;
};

export function ResumeBuilder({ resume }: TResumeBuilderProps) {
  const queryClient = useQueryClient();

  const form = useForm<TResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: getResumeFormDefaults(resume)
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty }
  } = form;

  const sectionFields = useFieldArray({
    control,
    name: "sections"
  });

  const projectFields = useFieldArray({
    control,
    name: "projects"
  });

  const skillFields = useFieldArray({
    control,
    name: "skills"
  });

  const watchedValues = watch();

  const updateMutation = useMutation({
    mutationFn: updateAdminResume,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-resume"]
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-dashboard-overview"]
        })
      ]);
    }
  });

  const onSubmit = (values: TResumeFormValues) => {
    const payload: TResumeUpdatePayload = {
      title: values.title,
      targetRole: values.targetRole,
      summary: values.summary,
      isActive: values.isActive,
      sections: values.sections.map((section, index) => ({
        title: section.title,
        content: section.content,
        order: Number(section.order) || index + 1,
        isEnabled: section.isEnabled
      })),
      projects: values.projects.map((project, index) => ({
        name: project.name,
        description: project.description,
        techStack: splitCommaText(project.techStackText),
        liveLink: project.liveLink || null,
        githubLink: project.githubLink || null,
        order: Number(project.order) || index + 1,
        isEnabled: project.isEnabled
      })),
      skills: values.skills.map((skill, index) => ({
        category: skill.category,
        skills: splitCommaText(skill.skillsText),
        order: Number(skill.order) || index + 1,
        isEnabled: skill.isEnabled
      }))
    };

    updateMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
      <div className="space-y-8">
        <AdminFormCard
          title="Resume Basic Information"
          description="Create a role-focused resume profile for backend, full-stack, software engineering, or remote opportunities."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput
              label="Resume Title"
              placeholder="Backend Developer Resume"
              error={errors.title?.message}
              {...register("title")}
            />

            <AdminSelect
              label="Target Role"
              error={errors.targetRole?.message}
              options={[
                {
                  label: "Backend Developer",
                  value: "BACKEND_DEVELOPER"
                },
                {
                  label: "Full-Stack Developer",
                  value: "FULL_STACK_DEVELOPER"
                },
                {
                  label: "Software Engineer",
                  value: "SOFTWARE_ENGINEER"
                }
              ]}
              {...register("targetRole")}
            />
          </div>

          <div className="mt-5">
            <AdminTextarea
              label="Professional Summary"
              rows={5}
              placeholder="Write an ATS-friendly professional summary..."
              error={errors.summary?.message}
              {...register("summary")}
            />
          </div>

          <div className="mt-5">
            <AdminCheckbox
              label="Set as Active Resume"
              description="The active resume is used as the main resume version."
              {...register("isActive")}
            />
          </div>
        </AdminFormCard>

        <AdminFormCard
          title="Resume Sections"
          description="Add flexible sections like Professional Summary, Experience, Achievements, Coursework, or Extra Activities."
        >
          <div className="space-y-4">
            {sectionFields.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_120px_120px_auto] md:items-end">
                  <AdminInput
                    label="Section Title"
                    placeholder="Professional Summary"
                    error={errors.sections?.[index]?.title?.message}
                    {...register(`sections.${index}.title`)}
                  />

                  <AdminInput
                    label="Order"
                    type="number"
                    min={1}
                    error={errors.sections?.[index]?.order?.message}
                    {...register(`sections.${index}.order`, {
                      valueAsNumber: true
                    })}
                  />

                  <AdminCheckbox
                    label="Enabled"
                    {...register(`sections.${index}.isEnabled`)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => sectionFields.remove(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="mt-4">
                  <AdminTextarea
                    label="Content"
                    rows={5}
                    placeholder="Write section content..."
                    error={errors.sections?.[index]?.content?.message}
                    {...register(`sections.${index}.content`)}
                  />
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                sectionFields.append({
                  title: "",
                  content: "",
                  order: sectionFields.fields.length + 1,
                  isEnabled: true
                })
              }
            >
              <Plus className="mr-2" size={16} />
              Add Section
            </Button>
          </div>
        </AdminFormCard>

        <AdminFormCard
          title="Resume Projects"
          description="Add resume-friendly project descriptions with tech stack keywords."
        >
          <div className="space-y-4">
            {projectFields.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminInput
                    label="Project Name"
                    placeholder="Career.io"
                    error={errors.projects?.[index]?.name?.message}
                    {...register(`projects.${index}.name`)}
                  />

                  <AdminInput
                    label="Tech Stack"
                    placeholder="Next.js, Node.js, Express.js, PostgreSQL"
                    error={errors.projects?.[index]?.techStackText?.message}
                    {...register(`projects.${index}.techStackText`)}
                  />

                  <AdminInput
                    label="Live Link"
                    placeholder="https://..."
                    error={errors.projects?.[index]?.liveLink?.message}
                    {...register(`projects.${index}.liveLink`)}
                  />

                  <AdminInput
                    label="GitHub Link"
                    placeholder="https://github.com/..."
                    error={errors.projects?.[index]?.githubLink?.message}
                    {...register(`projects.${index}.githubLink`)}
                  />
                </div>

                <div className="mt-4">
                  <AdminTextarea
                    label="Project Description"
                    rows={4}
                    placeholder="Write an ATS-friendly project description..."
                    error={errors.projects?.[index]?.description?.message}
                    {...register(`projects.${index}.description`)}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[120px_140px_auto] md:items-end">
                  <AdminInput
                    label="Order"
                    type="number"
                    min={1}
                    error={errors.projects?.[index]?.order?.message}
                    {...register(`projects.${index}.order`, {
                      valueAsNumber: true
                    })}
                  />

                  <AdminCheckbox
                    label="Enabled"
                    {...register(`projects.${index}.isEnabled`)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => projectFields.remove(index)}
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
                projectFields.append({
                  name: "",
                  description: "",
                  techStackText: "",
                  liveLink: "",
                  githubLink: "",
                  order: projectFields.fields.length + 1,
                  isEnabled: true
                })
              }
            >
              <Plus className="mr-2" size={16} />
              Add Project
            </Button>
          </div>
        </AdminFormCard>

        <AdminFormCard
          title="Resume Skills"
          description="Add skill categories and comma-separated skills for ATS-friendly keyword matching."
        >
          <div className="space-y-4">
            {skillFields.fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminInput
                    label="Category"
                    placeholder="Backend"
                    error={errors.skills?.[index]?.category?.message}
                    {...register(`skills.${index}.category`)}
                  />

                  <AdminInput
                    label="Skills"
                    placeholder="Node.js, Express.js, REST API, JWT"
                    error={errors.skills?.[index]?.skillsText?.message}
                    {...register(`skills.${index}.skillsText`)}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[120px_140px_auto] md:items-end">
                  <AdminInput
                    label="Order"
                    type="number"
                    min={1}
                    error={errors.skills?.[index]?.order?.message}
                    {...register(`skills.${index}.order`, {
                      valueAsNumber: true
                    })}
                  />

                  <AdminCheckbox
                    label="Enabled"
                    {...register(`skills.${index}.isEnabled`)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => skillFields.remove(index)}
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
                skillFields.append({
                  category: "",
                  skillsText: "",
                  order: skillFields.fields.length + 1,
                  isEnabled: true
                })
              }
            >
              <Plus className="mr-2" size={16} />
              Add Skill Category
            </Button>
          </div>
        </AdminFormCard>

        {updateMutation.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {getErrorMessage(updateMutation.error)}
          </div>
        ) : null}

        {updateMutation.isSuccess ? (
          <div className="rounded-2xl border border-(--color-accent)/30 bg-(--color-accent)/10 p-4 text-sm text-accent">
            Resume updated successfully.
          </div>
        ) : null}

        <div className="sticky bottom-4 z-20 flex justify-end">
          <div className="rounded-full border border-site bg-(--color-background)/90 p-2 shadow-lg backdrop-blur-xl">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className={cn(!isDirty && "opacity-90")}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 animate-spin" size={17} />
              ) : (
                <Save className="mr-2" size={17} />
              )}
              Save Resume
            </Button>
          </div>
        </div>
      </div>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <AdminFormCard
          title="Live Resume Preview"
          description="This preview helps you see how the resume content will look to recruiters."
        >
          <ResumePreview values={watchedValues} />
        </AdminFormCard>
      </div>
    </form>
  );
}