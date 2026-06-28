import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import EffectHub from "@/components/EffectHub";

export const metadata: Metadata = {
  title: "Effect Hub | Surabhi Verma",
  description:
    "Interactive visual effects — liquid gradients, mesh backgrounds, and touch-driven UI experiments.",
};

export default function EffectHubPage() {
  return (
    <>
      <SiteNav />
      <EffectHub />
    </>
  );
}
