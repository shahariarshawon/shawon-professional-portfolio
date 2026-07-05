import { Footer } from "@/components/public/footer/footer";
import { Navbar } from "@/components/public/navbar/navbar";
import { ProjectChallenges } from "@/components/public/project-details/project-challenges";
import { ProjectCTA } from "@/components/public/project-details/project-cta";
import { ProjectFeatures } from "@/components/public/project-details/project-features";
import { ProjectGallery } from "@/components/public/project-details/project-gallery";
import { ProjectHero } from "@/components/public/project-details/project-hero";
import { ProjectImprovements } from "@/components/public/project-details/project-improvements";
import { ProjectOverview } from "@/components/public/project-details/project-overview";
import { ProjectTechStack } from "@/components/public/project-details/project-tech-stack";
import { TFooter, TNavbarItem, TProject } from "@/types/portfolio";

type TProjectDetailsViewProps = {
  project: TProject;
  navbar: TNavbarItem[];
  footer: TFooter | null;
};

export function ProjectDetailsView({
  project,
  navbar,
  footer,
}: TProjectDetailsViewProps) {
  return (
    <div className="min-h-screen bg-site">
      <Navbar items={navbar} />

      <main id="main-content">
        <ProjectHero project={project} />

        <section className="pb-20">
          <div className="container-custom">
            <ProjectGallery
              images={project.images || []}
              projectName={project.name}
            />
          </div>
        </section>

        <ProjectOverview project={project} />
        <ProjectTechStack project={project} />
        <ProjectFeatures features={project.features || []} />
        <ProjectChallenges challenges={project.challenges || []} />
        <ProjectImprovements improvements={project.improvements || []} />
        <ProjectCTA />
      </main>

      {footer ? <Footer footer={footer} /> : null}
    </div>
  );
}
