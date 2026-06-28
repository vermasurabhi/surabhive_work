import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "About | Surabhi Verma",
  description:
    "Learn about Surabhi Verma, a web developer focused on modern, performant web experiences.",
};

export default function AboutPage() {
  return (
    <section className="about-page" id="about-page">
      <SiteNav currentPage="about" />
      <div className="about-content">
        <h1>About</h1>
        <p>
          I am Surabhi Verma, a web developer focused on clean, modern websites and
          product experiences.
        </p>
        <p>
          I design and build performant interfaces with clear structure, smooth
          interaction, and strong visual identity.
        </p>
      </div>
    </section>
  );
}
