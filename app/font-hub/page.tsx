import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import FontHub from "@/components/FontHub";

export const metadata: Metadata = {
  title: "Font Hub | Surabhi Verma",
  description:
    "A curated collection of open-source fonts I love to use — scripts, serifs, and UI typefaces.",
};

export default function FontHubPage() {
  return (
    <>
      <SiteNav />
      <FontHub />
    </>
  );
}
