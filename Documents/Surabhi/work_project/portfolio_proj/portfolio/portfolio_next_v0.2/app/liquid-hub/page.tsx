import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import LiquidHub from "@/components/LiquidHub";

export const metadata: Metadata = {
  title: "Liquid Hub | Surabhi Verma",
  description:
    "Interactive liquid gradient with touch ripples — white base with Puddle Jumper, Thistle Down, Dusty Lavender, and palette tones.",
};

export default function LiquidHubPage() {
  return (
    <>
      <SiteNav />
      <LiquidHub />
    </>
  );
}
