import { NavBar } from "@/components/portfolio/NavBar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { CertEducationSection } from "@/components/portfolio/CertEducationSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { FooterSection } from "@/components/portfolio/FooterSection";
import { ScrollToTopButton } from "@/components/portfolio/ScrollToTopButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertEducationSection />
        <ContactSection />
      </main>
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
}
