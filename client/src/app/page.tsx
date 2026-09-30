export const dynamic = "force-dynamic";

import { IntroGate } from "@/components/loader/intro-gate";
import { AiChatWidget } from "@/components/public/ai-chat/ai-chat-widget";
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
import { siteConfig } from "@/constants/site";
import { getPortfolio } from "@/lib/public-api";

export default async function HomePage() {
  // Render with built-in fallbacks rather than the error page if the API is
  // cold-starting or unreachable.
  const portfolio = await getPortfolio().catch(() => null);

  return (
    <div className="min-h-screen overflow-x-clip bg-site">
      <IntroGate
        name={portfolio?.hero?.name || siteConfig.name}
        tagline={siteConfig.brandTagline}
      />

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

      <AiChatWidget />
    </div>
  );
}
