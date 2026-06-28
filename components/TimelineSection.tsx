"use client";

import { useEffect } from "react";
import { TIMELINE_ENTRIES } from "@/data/timeline";

export default function TimelineSection() {
  useEffect(() => {
    

    import("@/lib/effects/noiseGradient").then(({ initNoiseGradientSection }) => {
      const root = document.getElementById("timeline");
      const track = document.getElementById("timeline-track");
      const rail = document.getElementById("timeline-rail");
      if (!root || !track || !rail) return;

      initNoiseGradientSection(root, "timeline-canvas-gradient", "timeline-canvas-grain");

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobileMq = window.matchMedia("(max-width: 767px)");

      function usesHorizontalScroll() { return mobileMq.matches || reduceMotion; }
      function getMaxShift() { return Math.max(0, track!.scrollWidth - rail!.clientWidth); }

      function setSectionHeight() {
        if (usesHorizontalScroll()) {
          root!.classList.add("timeline--horizontal");
          root!.style.height = "auto";
          track!.style.transform = "translateX(0)";
          return;
        }
        root!.classList.remove("timeline--horizontal");
        const maxShift = getMaxShift();
        const scrollDistance = Math.max(window.innerHeight * 1.5, maxShift * 1.35 + window.innerHeight);
        root!.style.setProperty("--timeline-scroll-height", `${scrollDistance}px`);
      }

      function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

      function updateTrackPosition() {
        if (usesHorizontalScroll()) { track!.style.transform = "translateX(0)"; return; }
        const maxShift = getMaxShift();
        if (maxShift <= 0) { track!.style.transform = "translateX(0)"; return; }
        const rect = root!.getBoundingClientRect();
        const scrollRange = Math.max(1, root!.offsetHeight - window.innerHeight);
        const progress = clamp(-rect.top / scrollRange, 0, 1);
        track!.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
      }

      function refresh() { setSectionHeight(); updateTrackPosition(); }
      refresh();
      window.addEventListener("scroll", updateTrackPosition, { passive: true });
      window.addEventListener("resize", refresh);
      mobileMq.addEventListener("change", refresh);

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(refresh);
        observer.observe(track!);
        observer.observe(rail!);
      }
    });

    
  }, []);

  return (
    <section id="timeline" className="timeline" aria-labelledby="timeline-heading">
      <canvas id="timeline-canvas-gradient" className="timeline-canvas timeline-canvas--gradient" aria-hidden="true" />
      <div className="timeline-pin">
        <div className="timeline-viewport" id="timeline-viewport">
          <div className="timeline-header">
            <h2 id="timeline-heading" className="timeline-heading">Experience &amp; Education</h2>
            <p className="timeline-hint timeline-hint--desktop">Scroll to explore the journey</p>
            <p className="timeline-hint timeline-hint--mobile">Swipe horizontally to explore</p>
          </div>
          <div className="timeline-rail" id="timeline-rail">
            <div className="timeline-track" id="timeline-track">
              <div className="timeline-line" aria-hidden="true" />
              {TIMELINE_ENTRIES.map((entry) => (
                <article key={entry.id} className="timeline-milestone" data-timeline-id={entry.id}>
                  <div className="timeline-marker">
                    <span className="timeline-dot" aria-hidden="true" />
                    <time className="timeline-date" dateTime={entry.period}>{entry.period}</time>
                  </div>
                  <div className="timeline-card">
                    <span className="timeline-card-kind">{entry.kind === "education" ? "Education" : "Experience"}</span>
                    <h3 className="timeline-card-title">{entry.title}</h3>
                    <p className="timeline-card-org">{entry.organization}</p>
                    {entry.projects && <p className="timeline-card-projects">{entry.projects}</p>}
                    <ul className="timeline-card-list">
                      {entry.highlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <canvas id="timeline-canvas-grain" className="timeline-canvas timeline-canvas--grain" aria-hidden="true" />
    </section>
  );
}
