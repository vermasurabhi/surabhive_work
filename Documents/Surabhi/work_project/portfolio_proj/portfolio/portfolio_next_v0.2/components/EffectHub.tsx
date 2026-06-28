"use client";

import { useEffect } from "react";
import { EFFECT_HUB_ITEMS, type EffectHubItem } from "@/data/effects";
import Link from "next/link";

function MediaPreview({ item }: { item: EffectHubItem }) {
  if (item.image) {
    return <img src={item.image} alt={item.description} loading="lazy" decoding="async" draggable={false} />;
  }
  if (item.preview === "liquid") {
    return (
      <div className="effect-hub-preview effect-hub-preview--liquid" aria-hidden="true">
        <span className="effect-hub-blob effect-hub-blob--a" />
        <span className="effect-hub-blob effect-hub-blob--b" />
        <span className="effect-hub-blob effect-hub-blob--c" />
      </div>
    );
  }
  if (item.preview === "mesh") {
    return (
      <div className="effect-hub-preview effect-hub-preview--mesh" id={`effect-preview-${item.id}`} aria-hidden="true">
        <canvas className="effect-hub-preview-canvas effect-hub-preview-canvas--gradient" id={`effect-preview-${item.id}-gradient`} aria-hidden="true" />
        <canvas className="effect-hub-preview-canvas effect-hub-preview-canvas--grain" id={`effect-preview-${item.id}-grain`} aria-hidden="true" />
      </div>
    );
  }
  return <div className="effect-hub-preview effect-hub-preview--fallback" aria-hidden="true" />;
}

function OpenLink({ item }: { item: EffectHubItem }) {
  const href = item.link ?? "#";
  const external = item.external !== false && /^https?:\/\//.test(href);
  if (external) {
    return <a href={href} className="effect-hub-open-btn" target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.description}`}>Open</a>;
  }
  return <Link href={href} className="effect-hub-open-btn" aria-label={`Open ${item.description}`}>Open</Link>;
}

export default function EffectHub() {
  useEffect(() => {
    

    import("@/lib/effects/noiseGradient").then(({ initNoiseGradientSection }) => {
      const root = document.getElementById("effect-hub");
      if (!root) return;
      initNoiseGradientSection(root, "effect-hub-canvas-gradient", "effect-hub-canvas-grain");

      EFFECT_HUB_ITEMS.forEach((item) => {
        if (item.preview !== "mesh") return;
        const previewRoot = document.getElementById(`effect-preview-${item.id}`);
        if (!previewRoot) return;
        initNoiseGradientSection(previewRoot, `effect-preview-${item.id}-gradient`, `effect-preview-${item.id}-grain`);
      });
    });

    
  }, []);

  return (
    <section id="effect-hub" className="effect-hub" aria-labelledby="effect-hub-heading">
      <canvas id="effect-hub-canvas-gradient" className="effect-hub-canvas effect-hub-canvas--gradient" aria-hidden="true" />
      <div className="effect-hub-inner">
        <h1 id="effect-hub-heading" className="effect-hub-heading">Effect Hub</h1>
        <div className="effect-hub-grid">
          {EFFECT_HUB_ITEMS.map((item) => (
            <article key={item.id} className="effect-hub-card" data-effect-id={item.id}>
              <div className="effect-hub-card-media">
                <MediaPreview item={item} />
                <OpenLink item={item} />
              </div>
              <div className="effect-hub-card-body">
                <p className="effect-hub-card-desc">{item.description}</p>
                <div className="effect-hub-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="effect-hub-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <canvas id="effect-hub-canvas-grain" className="effect-hub-canvas effect-hub-canvas--grain" aria-hidden="true" />
    </section>
  );
}
