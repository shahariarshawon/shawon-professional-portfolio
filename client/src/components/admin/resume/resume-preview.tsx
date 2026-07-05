import { Card } from "@/components/ui/card";
import { TResumeFormValues } from "./resume-schema";
import { formatTargetRole, splitCommaText } from "./resume-utils";

type TResumePreviewProps = {
  values: TResumeFormValues;
};

export function ResumePreview({ values }: TResumePreviewProps) {
  const enabledSections = values.sections.filter((section) => section.isEnabled);
  const enabledProjects = values.projects.filter((project) => project.isEnabled);
  const enabledSkills = values.skills.filter((skill) => skill.isEnabled);

  return (
    <Card className="p-6 md:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-slate-900">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-3xl font-bold text-slate-950">
            AL Shahariar Arafat Shawon
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-700">
            {formatTargetRole(values.targetRole)}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            {values.summary}
          </p>
        </div>

        {enabledSkills.length ? (
          <div className="border-b border-slate-200 py-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Skills
            </h3>

            <div className="mt-3 space-y-2">
              {enabledSkills.map((skill, index) => (
                <p key={`${skill.category}-${index}`} className="text-sm">
                  <span className="font-semibold">{skill.category}:</span>{" "}
                  {splitCommaText(skill.skillsText).join(", ")}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {enabledProjects.length ? (
          <div className="border-b border-slate-200 py-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
              Projects
            </h3>

            <div className="mt-4 space-y-4">
              {enabledProjects.map((project, index) => (
                <div key={`${project.name}-${index}`}>
                  <h4 className="font-bold text-slate-950">{project.name}</h4>

                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    <span className="font-semibold">Tech:</span>{" "}
                    {splitCommaText(project.techStackText).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {enabledSections.map((section, index) => (
          <div
            key={`${section.title}-${index}`}
            className="border-b border-slate-200 py-5 last:border-b-0"
          >
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
              {section.title}
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}