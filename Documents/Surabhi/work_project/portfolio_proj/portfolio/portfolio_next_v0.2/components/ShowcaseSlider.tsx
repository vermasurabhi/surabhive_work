"use client";

import { useEffect } from "react";
import { SHOWCASE_SLIDES, type ShowcaseSlide } from "@/data/showcase-slides";

const DURATION = 1.15;
const EASE = "power3.out";
const WHEEL_STEP_COOLDOWN_MS = 320;

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export default function ShowcaseSlider() {
  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const root = document.getElementById("showcase-slider");
      const frame = document.getElementById("showcase-frame");
      const track = document.getElementById("showcase-track");
      const fixedUi = document.getElementById("showcase-fixed-ui");
      const labelEl = document.getElementById("showcase-ui-label");
      const titleEl = document.getElementById("showcase-ui-title");
      const catsEl = document.getElementById("showcase-ui-cats");
      const pauseBtn = document.getElementById("showcase-pause");
      const dotsEl = document.getElementById("showcase-dots");
      const visitLinkEl = document.getElementById("showcase-visit-link");

      if (!root || !frame || !track || !fixedUi || !labelEl || !titleEl || !catsEl || !pauseBtn || !dotsEl || !visitLinkEl) return;

      const visitLink = visitLinkEl as HTMLAnchorElement;
      const dotButtons = dotsEl.querySelectorAll<HTMLButtonElement>(".showcase-dot");
      const navPrevBtn = document.getElementById("showcase-nav-prev");
      const navNextBtn = document.getElementById("showcase-nav-next");
      const n = SHOWCASE_SLIDES.length;
      if (n === 0) return;

      const slideEls = track.querySelectorAll<HTMLElement>(".showcase-slide");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let index = 0, slideStep = 0, isDragging = false, dragStartY = 0, dragStartIndexY = 0, lastWheelSlideMs = 0;
      const parallaxStrength = 0.04;

      function applySlideSizes() { slideStep = frame!.offsetHeight; slideEls.forEach(el => { el.style.height = `${slideStep}px`; el.style.width = "100%"; }); }
      function setTrackY(yPx: number) { gsap.set(track, { x: 0, y: yPx }); }

      function updateFixedUi() {
        const s = SHOWCASE_SLIDES[index];
        labelEl!.textContent = s.label;
        titleEl!.textContent = s.titleLine;
        catsEl!.innerHTML = s.categories.map(c => `<li>${escapeHtml(c)}</li>`).join("");
        visitLink.href = s.visitUrl;
      }

      function updateDots() {
        dotButtons.forEach((dot, i) => { const on = i === index; dot.classList.toggle("is-active", on); dot.setAttribute("aria-current", on ? "true" : "false"); });
      }

      function updateMobileNavButtons() {
        if (!(navPrevBtn instanceof HTMLButtonElement) || !(navNextBtn instanceof HTMLButtonElement)) return;
        navPrevBtn.disabled = index <= 0; navPrevBtn.setAttribute("aria-disabled", index <= 0 ? "true" : "false");
        navNextBtn.disabled = index >= n - 1; navNextBtn.setAttribute("aria-disabled", index >= n - 1 ? "true" : "false");
      }

      function syncVideos() { slideEls.forEach((el, i) => { const v = el.querySelector("video"); if (!v) return; if (i === index) void v.play().catch(() => {}); else v.pause(); }); }
      function animateSlideEntrance() { const inner = slideEls[index]?.querySelector<HTMLElement>(".showcase-media-inner"); if (inner) gsap.set(inner, { scale: 1, x: 0, y: 0 }); }
      function finishTransition() { updateFixedUi(); updateDots(); updateMobileNavButtons(); syncVideos(); animateSlideEntrance(); }

      function goNext() {
        applySlideSizes();
        if (index >= n - 1) { finishTransition(); return; }
        const target = index + 1;
        if (reduceMotion) { setTrackY(-target * slideStep); index = target; finishTransition(); return; }
        gsap.to(track, { x: 0, y: -target * slideStep, duration: DURATION, ease: EASE, onComplete: () => { index = target; finishTransition(); } });
      }

      function goPrev() {
        applySlideSizes();
        if (index === 0) { finishTransition(); return; }
        const target = index - 1;
        if (reduceMotion) { index = target; setTrackY(-index * slideStep); finishTransition(); return; }
        gsap.to(track, { x: 0, y: -target * slideStep, duration: DURATION, ease: EASE, onComplete: () => { index = target; finishTransition(); } });
      }

      function goToLogicalIndex(L: number) {
        if (L < 0 || L >= n || L === index) return;
        applySlideSizes();
        if (reduceMotion) { index = L; setTrackY(-index * slideStep); finishTransition(); return; }
        gsap.to(track, { x: 0, y: -L * slideStep, duration: DURATION, ease: EASE, onComplete: () => { index = L; finishTransition(); } });
      }

      function syncIndexFromTrackPosition() {
        applySlideSizes();
        if (slideStep <= 0) return;
        const y = Number(gsap.getProperty(track, "y"));
        index = Math.max(0, Math.min(n - 1, Math.round(-y / slideStep)));
      }

      function onWheel(e: WheelEvent) {
        const r = root!.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        if (r.top > 1) return;
        if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
        const atFirst = index === 0, atLast = index === n - 1;
        if ((atFirst && e.deltaY < 0) || (atLast && e.deltaY > 0)) return;
        if (!reduceMotion && (gsap.isTweening(track) || isDragging)) { e.preventDefault(); return; }
        if (reduceMotion && Date.now() - lastWheelSlideMs < WHEEL_STEP_COOLDOWN_MS) { e.preventDefault(); return; }
        e.preventDefault();
        lastWheelSlideMs = Date.now();
        if (e.deltaY > 0) goNext(); else if (e.deltaY < 0) goPrev();
      }

      function onPointerDown(e: PointerEvent) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        gsap.killTweensOf(track); isDragging = true; frame!.classList.add("is-dragging");
        dragStartY = e.clientY; dragStartIndexY = Number(gsap.getProperty(track, "y"));
        try { frame!.setPointerCapture(e.pointerId); } catch {}
      }

      function onPointerMove(e: PointerEvent) { if (!isDragging) return; gsap.set(track, { x: 0, y: dragStartIndexY + e.clientY - dragStartY }); }

      function snapTrackToNearest() {
        applySlideSizes();
        const y = Number(gsap.getProperty(track, "y"));
        const nearest = Math.max(0, Math.min(n - 1, Math.round(-y / slideStep)));
        gsap.to(track, { x: 0, y: -nearest * slideStep, duration: 0.5, ease: EASE, onComplete: () => { index = nearest; finishTransition(); } });
      }

      function onPointerUp(e: PointerEvent) {
        if (!isDragging) return;
        isDragging = false; frame!.classList.remove("is-dragging");
        try { if (frame!.hasPointerCapture(e.pointerId)) frame!.releasePointerCapture(e.pointerId); } catch {}
        applySlideSizes();
        const dy = e.clientY - dragStartY, threshold = slideStep * 0.12;
        if (dy < -threshold) goNext(); else if (dy > threshold) goPrev(); else snapTrackToNearest();
      }

      function onFrameMove(e: MouseEvent) {
        if (reduceMotion) return;
        const inner = slideEls[index]?.querySelector<HTMLElement>(".showcase-media-inner");
        if (!inner) return;
        const b = frame!.getBoundingClientRect();
        gsap.to(inner, { x: 0, y: ((e.clientY - b.top) / b.height - 0.5) * b.height * parallaxStrength, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      }

      function onFrameLeave() { const inner = slideEls[index]?.querySelector<HTMLElement>(".showcase-media-inner"); if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: EASE }); }

      dotsEl.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement).closest("button[data-slide-index]");
        if (!btn) return;
        const idx = Number(btn.getAttribute("data-slide-index"));
        if (Number.isFinite(idx)) goToLogicalIndex(idx);
      });

      if (navPrevBtn instanceof HTMLButtonElement) navPrevBtn.addEventListener("click", () => { gsap.killTweensOf(track); syncIndexFromTrackPosition(); goPrev(); });
      if (navNextBtn instanceof HTMLButtonElement) navNextBtn.addEventListener("click", () => { gsap.killTweensOf(track); syncIndexFromTrackPosition(); goNext(); });
      pauseBtn.addEventListener("click", () => pauseBtn.classList.toggle("is-paused"));

      applySlideSizes(); setTrackY(0); finishTransition();
      window.addEventListener("resize", () => { applySlideSizes(); setTrackY(-index * slideStep); });
      requestAnimationFrame(() => { applySlideSizes(); setTrackY(-index * slideStep); });

      root.addEventListener("wheel", onWheel, { passive: false });
      frame.addEventListener("pointerdown", onPointerDown);
      frame.addEventListener("pointermove", onPointerMove);
      frame.addEventListener("pointerup", onPointerUp);
      frame.addEventListener("pointercancel", onPointerUp);
      frame.addEventListener("mousemove", onFrameMove);
      frame.addEventListener("mouseleave", onFrameLeave);
    });
  }, []);

  const first = SHOWCASE_SLIDES[0];

  return (
    <section id="showcase-slider" className="showcase" aria-label="Featured projects">
      <div className="showcase-fixed" id="showcase-fixed-ui">
        <div className="showcase-fixed-left">
          <div className="showcase-fixed-rail" aria-hidden={false}>
            <div className="showcase-dots" id="showcase-dots" role="tablist" aria-label="Slides">
              {SHOWCASE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === 0 ? "showcase-dot is-active" : "showcase-dot"}
                  data-slide-index={i}
                  aria-label={`Project ${i + 1}`}
                  aria-current={i === 0 ? "true" : "false"}
                />
              ))}
            </div>
          </div>
          <div className="showcase-fixed-copy">
            <span className="showcase-fixed-label" id="showcase-ui-label">{first.label}</span>
            <h2 className="showcase-fixed-title" id="showcase-ui-title">{first.titleLine}</h2>
            <ul className="showcase-fixed-cats" id="showcase-ui-cats">
              {first.categories.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
        <button type="button" className="showcase-pause" id="showcase-pause" aria-label="Pause slideshow">
          <span className="showcase-pause-bar" aria-hidden="true" />
          <span className="showcase-pause-bar" aria-hidden="true" />
        </button>
        <a href={first.visitUrl} id="showcase-visit-link" className="showcase-discover" target="_blank" rel="noopener noreferrer">
          Visit ↗
        </a>
      </div>
      <div className="showcase-shell">
        <div className="showcase-frame-wrap">
          <button type="button" className="showcase-nav showcase-nav--prev" id="showcase-nav-prev" aria-label="Previous project">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="showcase-frame" id="showcase-frame" tabIndex={0}>
            <div className="showcase-track" id="showcase-track">
              {SHOWCASE_SLIDES.map((s: ShowcaseSlide) => (
                <div key={s.id} className="showcase-slide" data-slide-id={s.id}>
                  <div className="showcase-media-wrap">
                    <div className="showcase-media-inner">
                      <img
                        src={s.media.kind === "image" ? s.media.src : s.media.posterSrc}
                        alt={s.media.kind === "image" ? s.media.alt : s.id}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="showcase-nav showcase-nav--next" id="showcase-nav-next" aria-label="Next project">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
