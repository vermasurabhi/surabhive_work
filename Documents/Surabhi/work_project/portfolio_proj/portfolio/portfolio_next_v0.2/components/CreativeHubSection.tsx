"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CREATIVE_HUB_ITEMS } from "@/data/creative-hub";

const HEART_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
const SHARE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51 15.42 17.49" /><path d="M15.41 6.51 8.59 10.49" />
  </svg>
);
const ARROW_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
  </svg>
);

const LIKES_KEY = "creative-hub-likes";

export default function CreativeHubSection() {
  useEffect(() => {
    

    import("@/lib/effects/noiseGradient").then(({ initNoiseGradientSection }) => {
      const root = document.getElementById("creative-hub");
      if (!root) return;
      initNoiseGradientSection(root, "creative-hub-canvas-gradient", "creative-hub-canvas-grain");

      // Likes
      let likedIds: Set<string>;
      try {
        const raw = localStorage.getItem(LIKES_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        likedIds = new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
      } catch { likedIds = new Set(); }

      root.querySelectorAll<HTMLButtonElement>(".creative-hub-like").forEach((button) => {
        const id = button.dataset.likeId;
        if (!id) return;
        if (likedIds.has(id)) { button.classList.add("is-liked"); button.setAttribute("aria-pressed", "true"); }
        button.addEventListener("click", () => {
          const isLiked = button.classList.toggle("is-liked");
          button.setAttribute("aria-pressed", isLiked ? "true" : "false");
          if (isLiked) likedIds.add(id); else likedIds.delete(id);
          try { localStorage.setItem(LIKES_KEY, JSON.stringify([...likedIds])); } catch {}
        });
      });

      root.querySelectorAll<HTMLButtonElement>(".creative-hub-share").forEach((button) => {
        button.addEventListener("click", async () => {
          const url = button.dataset.shareUrl;
          const title = button.dataset.shareTitle ?? "Creative work";
          if (!url) return;
          if (navigator.share) { try { await navigator.share({ title, url }); return; } catch {} }
          try {
            await navigator.clipboard.writeText(url);
            button.classList.add("is-shared");
            window.setTimeout(() => button.classList.remove("is-shared"), 1400);
          } catch { window.open(url, "_blank", "noopener,noreferrer"); }
        });
      });
    });

    
  }, []);

  return (
    <section id="creative-hub" className="creative-hub" aria-labelledby="creative-hub-heading">
      <canvas id="creative-hub-canvas-gradient" className="creative-hub-canvas creative-hub-canvas--gradient" aria-hidden="true" />
      <div className="creative-hub-inner">
        <h2 id="creative-hub-heading" className="creative-hub-heading">My Creative Hub</h2>
        <div className="creative-hub-grid">
          {CREATIVE_HUB_ITEMS.map((item) => {
            const isExternal = item.external !== false;
            const linkLabel = isExternal ? `Open ${item.alt}` : `Go to ${item.alt}`;
            return (
              <article key={item.id} className="creative-hub-card" data-creative-id={item.id}>
                <div className="creative-hub-card-frame">
                  <div className="creative-hub-card-media">
                    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" draggable={false} />
                  </div>
                  <div className="creative-hub-card-actions">
                    <div className="creative-hub-card-actions-left">
                      <button
                        type="button"
                        className="creative-hub-action creative-hub-like"
                        data-like-id={item.id}
                        aria-label={`Like ${item.alt}`}
                        aria-pressed="false"
                      >
                        {HEART_SVG}
                      </button>
                      <button
                        type="button"
                        className="creative-hub-action creative-hub-share"
                        data-share-url={item.link}
                        data-share-title={item.alt}
                        aria-label={`Share ${item.alt}`}
                      >
                        {SHARE_SVG}
                      </button>
                    </div>
                    {isExternal ? (
                      <a
                        href={item.link}
                        className="creative-hub-action creative-hub-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={linkLabel}
                      >
                        {ARROW_SVG}
                      </a>
                    ) : (
                      <Link
                        href={item.link}
                        className="creative-hub-action creative-hub-link"
                        aria-label={linkLabel}
                      >
                        {ARROW_SVG}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <canvas id="creative-hub-canvas-grain" className="creative-hub-canvas creative-hub-canvas--grain" aria-hidden="true" />
    </section>
  );
}
