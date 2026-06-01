import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Satyanarayana Chodisetti — Gen AI Full Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Satyanarayana Chodisetti, a Gen AI Full Stack Developer building modern web applications and AI-native products.",
      },
      { property: "og:title", content: "Satyanarayana Chodisetti — Gen AI Full Stack Developer" },
      {
        property: "og:description",
        content:
          "Portfolio of Satyanarayana Chodisetti, a Gen AI Full Stack Developer building modern web applications and AI-native products.",
      },
    ],
  }),
  component: Index,
});

function Index() {
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
