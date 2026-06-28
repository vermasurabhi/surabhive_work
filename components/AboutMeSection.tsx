"use client";

import { useEffect } from "react";

const ABOUT_SLIDES = [
  { type: "image", src: "/assets/me.png", alt: "Collage of portraits, flowers, and celestial motifs" },
  { type: "image", src: "/assets/studio.jpg", alt: "Design studio workspace with Figma on screen" },
  { type: "video", src: "/assets/video1.mp4", alt: "Studio workspace video" },
] as const;

const ARROW_PREV = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ARROW_NEXT = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function AboutMeSection() {
  useEffect(() => {
    

    Promise.all([
      import("@/lib/effects/noiseGradient"),
      import("gsap"),
    ]).then(([{ initNoiseGradientSection }, { gsap }]) => {
      const root = document.getElementById("about-me");
      if (!root) return;
      initNoiseGradientSection(root, "about-me-canvas-gradient", "about-me-canvas-grain");

      const stack = document.getElementById("about-me-stack");
      const prevBtn = document.getElementById("about-me-prev");
      const nextBtn = document.getElementById("about-me-next");
      if (!stack || !prevBtn || !nextBtn) return;

      const slides = stack.querySelectorAll<HTMLElement>(".about-me-stack-slide");
      const count = slides.length;
      if (count === 0) return;

      let activeIndex = 0;
      let animating = false;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function syncVideoPlayback() {
        slides.forEach((slide, i) => {
          const video = slide.querySelector<HTMLVideoElement>(".about-me-stack-video");
          if (!video) return;
          if (i === activeIndex && !reduceMotion) {
            void video.play().catch(() => {});
            return;
          }
          video.pause();
          if (i !== activeIndex) video.currentTime = 0;
        });
      }

      function stackTransform(offset: number) {
        if (offset === 0) return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 30 };
        if (offset === -1) return { x: -28, y: 18, rotate: -10, scale: 0.9, opacity: 0.88, z: 20 };
        if (offset === 1) return { x: 28, y: 18, rotate: 10, scale: 0.9, opacity: 0.88, z: 20 };
        if (offset === -2) return { x: -46, y: 32, rotate: -16, scale: 0.82, opacity: 0.55, z: 10 };
        if (offset === 2) return { x: 46, y: 32, rotate: 16, scale: 0.82, opacity: 0.55, z: 10 };
        return { x: 0, y: 40, rotate: 0, scale: 0.75, opacity: 0, z: 0 };
      }

      function relativeOffset(slideIndex: number, len: number) {
        let offset = slideIndex - activeIndex;
        if (offset > len / 2) offset -= len;
        if (offset < -len / 2) offset += len;
        return offset;
      }

      function wrapIndex(index: number, length: number) {
        return ((index % length) + length) % length;
      }

      function applyStack(instant = false) {
        slides.forEach((slide, i) => {
          const offset = relativeOffset(i, count);
          const t = stackTransform(offset);
          slide.style.zIndex = String(t.z);
          gsap.to(slide, {
            x: t.x, y: t.y, rotation: t.rotate, scale: t.scale, opacity: t.opacity,
            duration: instant || reduceMotion ? 0 : 0.55,
            ease: "power3.out", overwrite: true,
          });
        });
        syncVideoPlayback();
      }

      function goTo(nextIndex: number) {
        if (animating || count <= 1) return;
        const target = wrapIndex(nextIndex, count);
        if (target === activeIndex) return;
        animating = true;
        activeIndex = target;
        applyStack();
        window.setTimeout(() => { animating = false; }, reduceMotion ? 0 : 560);
      }

      prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
      nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

      let dragStartX = 0;
      stack.addEventListener("pointerdown", (e) => { dragStartX = e.clientX; });
      stack.addEventListener("pointerup", (e) => {
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) < 36) return;
        if (dx > 0) goTo(activeIndex - 1); else goTo(activeIndex + 1);
      });

      applyStack(true);
    });

    
  }, []);

  return (
    <section id="about-me" className="about-me" aria-labelledby="about-me-heading">
      <canvas id="about-me-canvas-gradient" className="about-me-canvas about-me-canvas--gradient" aria-hidden="true" />
      <div className="about-me-inner">
        <h2 id="about-me-heading" className="about-me-heading">About Me</h2>
        <article className="about-me-card">
          <div className="about-me-card-copy">
            <p>
              I&apos;m a frontend-focused developer who loves building visually polished and highly
              interactive web experiences.
            </p>
            <p>
              My work combines modern UI design, scalable frontend architecture, and
              performance-driven development using technologies like React.js, Next.js, and
              Tailwind CSS.
            </p>
            <p>
              I enjoy crafting products that not only function well but also feel intuitive,
              immersive, and memorable to users.
            </p>
          </div>
          <div className="about-me-card-visual">
            <div className="about-me-stack" id="about-me-stack" aria-live="polite">
              {ABOUT_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className="about-me-stack-slide"
                  data-slide-index={i}
                  data-slide-type={slide.type}
                >
                  {slide.type === "video" ? (
                    <video
                      className="about-me-stack-video"
                      src={slide.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={slide.alt}
                    />
                  ) : (
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="about-me-stack-controls">
              <button type="button" className="about-me-stack-btn" id="about-me-prev" aria-label="Previous slide">
                {ARROW_PREV}
              </button>
              <button type="button" className="about-me-stack-btn" id="about-me-next" aria-label="Next slide">
                {ARROW_NEXT}
              </button>
            </div>
          </div>
        </article>
      </div>
      <canvas id="about-me-canvas-grain" className="about-me-canvas about-me-canvas--grain" aria-hidden="true" />
    </section>
  );
}
