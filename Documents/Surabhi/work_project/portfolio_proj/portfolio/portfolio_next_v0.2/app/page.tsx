import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SiteNav from "@/components/SiteNav";
import AboutMeSection from "@/components/AboutMeSection";
import SkillsSection from "@/components/SkillsSection";
import TimelineSection from "@/components/TimelineSection";
import ShowcaseSlider from "@/components/ShowcaseSlider";
import CreativeHubSection from "@/components/CreativeHubSection";
import ContactSection from "@/components/ContactSection";
import CursorEffects from "@/components/CursorEffects";

export const metadata: Metadata = {
  title: "Surabhi Verma | Web Developer",
  description:
    "Portfolio of Surabhi Verma featuring web development projects, UI craft, and digital product work.",
};

export default function HomePage() {
  return (
    <>
      <SiteNav currentPage="home" />
      <Hero />
      <AboutMeSection />
      <SkillsSection />
      <TimelineSection />
      <div id="work">
        <ShowcaseSlider />
      </div>
      <CreativeHubSection />
      <ContactSection />
      <CursorEffects />
    </>
  );
}
