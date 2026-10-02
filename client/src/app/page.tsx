import { IntroGate } from "@/components/loader/intro-gate";
import { AboutSection } from "@/components/public/about/about-section";
import { ContactSection } from "@/components/public/contact/contact-section";
import { EducationCertificationsSection } from "@/components/public/education/education-certifications-section";
import { ExperienceSection } from "@/components/public/experience/experience-section";
import { Footer } from "@/components/public/footer/footer";
import { HeroSection } from "@/components/public/hero/hero-section";
import { Navbar } from "@/components/public/navbar/navbar";
import { ProjectsSection } from "@/components/public/projects/projects-section";
import { ServicesSection } from "@/components/public/services/services-section";
import { SkillsSection } from "@/components/public/skills/skills-section";
import { SectionBoundary } from "@/components/shared/section-boundary";
import { siteConfig } from "@/constants/site";
import { getPortfolio, isBuildPhase } from "@/lib/public-api";

// Statically generated, then refreshed in the background at most once per
// interval: visitors always get an instant cached page. Must be a literal
// (keep in sync with REVALIDATE_SECONDS in lib/public-api).
export const revalidate = 60;

export default async function HomePage() {
  // Every section has a built-in fallback, so the page still renders if the
  // API is unreachable during the build. At runtime a failure is rethrown so
  // Next.js keeps serving the last good page rather than caching an empty one.
  const portfolio = await getPortfolio().catch((error: unknown) => {
    if (isBuildPhase) {
      console.warn("[home] API unreachable during build, using fallbacks:", error);
      return null;
    }

    throw error;
  });

  return (
    <div className="min-h-screen overflow-x-clip bg-site">
      <IntroGate
        name={portfolio?.hero?.name || siteConfig.name}
        tagline={siteConfig.brandTagline}
      />

      <Navbar items={portfolio?.navbar || []} />

      <main id="main-content">
        <SectionBoundary name="introduction">
          <HeroSection hero={portfolio?.hero || null} />
        </SectionBoundary>
        <SectionBoundary name="about">
          <AboutSection about={portfolio?.about || null} />
        </SectionBoundary>
        <SectionBoundary name="experience">
          <ExperienceSection experiences={portfolio?.experience || []} />
        </SectionBoundary>
        <SectionBoundary name="skills">
          <SkillsSection skills={portfolio?.skills || []} />
        </SectionBoundary>
        <SectionBoundary name="projects">
          <ProjectsSection projects={portfolio?.projects || []} />
        </SectionBoundary>
        <SectionBoundary name="education">
          <EducationCertificationsSection
            education={portfolio?.education || []}
            certifications={portfolio?.certifications || []}
          />
        </SectionBoundary>
        <SectionBoundary name="services">
          <ServicesSection services={portfolio?.services || []} />
        </SectionBoundary>
        <SectionBoundary name="contact">
          <ContactSection
            contactInfo={portfolio?.contactInfo || null}
            socialLinks={portfolio?.hero?.socialLinks || []}
          />
        </SectionBoundary>
      </main>

      <Footer footer={portfolio?.footer} />
    </div>
  );
}
