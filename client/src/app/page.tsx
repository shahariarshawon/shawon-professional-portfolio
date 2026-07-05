export const dynamic = "force-dynamic";

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
import { getPortfolio } from "@/lib/public-api";

export default async function HomePage() {
  const portfolio = await getPortfolio();

  return (
    <div className="min-h-screen bg-site">
      <Navbar items={portfolio?.navbar || []} />

      <main id="main-content">
        <HeroSection hero={portfolio?.hero || null} />
        <AboutSection about={portfolio?.about || null} />
        <ExperienceSection experiences={portfolio?.experience || []} />
        <SkillsSection skills={portfolio?.skills || []} />
        <ProjectsSection projects={portfolio?.projects || []} />
        <EducationCertificationsSection
          education={portfolio?.education || []}
          certifications={portfolio?.certifications || []}
        />
        <ServicesSection services={portfolio?.services || []} />
        <ContactSection
          contactInfo={portfolio?.contactInfo || null}
          socialLinks={portfolio?.hero?.socialLinks || []}
        />
      </main>

      {portfolio?.footer ? <Footer footer={portfolio.footer} /> : null}
    </div>
  );
}