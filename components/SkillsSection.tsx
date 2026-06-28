"use client";

import { useEffect } from "react";
import { ALL_SKILLS, skillIconUrl } from "@/data/skills";

export default function SkillsSection() {
  useEffect(() => {
    

    Promise.all([
      import("@/lib/effects/noiseGradient"),
      import("gsap"),
    ]).then(([{ initNoiseGradientSection }, { gsap }]) => {
      const root = document.getElementById("skills");
      const stage = document.getElementById("skills-stage");
      const eclipse = document.getElementById("skills-eclipse");
      const tagsRoot = document.getElementById("skills-tags");
      const floatRoot = document.getElementById("skills-float");
      if (!root || !stage || !eclipse || !tagsRoot || !floatRoot) return;

      initNoiseGradientSection(root, "skills-canvas-gradient", "skills-canvas-grain");

      const tags = Array.from(tagsRoot.querySelectorAll<HTMLButtonElement>(".skills-tag"));
      const desktopHover = window.matchMedia("(min-width: 768px) and (hover: hover)");
      let activeFloat: HTMLImageElement | null = null;

      type Point = { x: number; y: number };
      type TagBox = { x: number; y: number; w: number; h: number };
      type EllipseBounds = { cx: number; cy: number; rx: number; ry: number };

      function seededRandom(seed: number) {
        const x = Math.sin(seed * 9999.1337) * 10000;
        return x - Math.floor(x);
      }

      function pointInsideEllipse(px: number, py: number, cx: number, cy: number, rx: number, ry: number) {
        return ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1;
      }

      function boxInsideEllipse(box: TagBox, ellipse: EllipseBounds, inset = 6) {
        const rx = ellipse.rx - inset, ry = ellipse.ry - inset;
        if (rx <= 0 || ry <= 0) return false;
        const hw = box.w * 0.5, hh = box.h * 0.5;
        return [
          { x: box.x - hw, y: box.y - hh },
          { x: box.x + hw, y: box.y - hh },
          { x: box.x - hw, y: box.y + hh },
          { x: box.x + hw, y: box.y + hh },
        ].every(p => pointInsideEllipse(p.x, p.y, ellipse.cx, ellipse.cy, rx, ry));
      }

      function boxesOverlap(a: TagBox, b: TagBox, gap = 8) {
        return Math.abs(a.x - b.x) < (a.w + b.w) * 0.5 + gap &&
               Math.abs(a.y - b.y) < (a.h + b.h) * 0.5 + gap;
      }

      function getEllipseBounds(): EllipseBounds {
        const sr = stage!.getBoundingClientRect(), er = eclipse!.getBoundingClientRect();
        return { cx: er.left - sr.left + er.width * 0.5, cy: er.top - sr.top + er.height * 0.5, rx: er.width * 0.5, ry: er.height * 0.5 };
      }

      function findTagPosition(tagW: number, tagH: number, placed: TagBox[], ellipse: EllipseBounds, seed: number): Point | null {
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let attempt = 0; attempt < 900; attempt++) {
          const t = (attempt + 1) / 900, angle = attempt * golden + seededRandom(seed) * 0.35;
          const radius = Math.sqrt(t) * 0.94;
          const x = ellipse.cx + Math.cos(angle) * ellipse.rx * radius;
          const y = ellipse.cy + Math.sin(angle) * ellipse.ry * radius;
          const box: TagBox = { x, y, w: tagW, h: tagH };
          if (!boxInsideEllipse(box, ellipse)) continue;
          if (placed.some(other => boxesOverlap(box, other))) continue;
          return { x, y };
        }
        return null;
      }

      function layout() {
        const stageRect = stage!.getBoundingClientRect();
        if (stageRect.width <= 0) return;
        const ellipse = getEllipseBounds();
        tags.forEach(tag => { tag.style.left = "50%"; tag.style.top = "50%"; tag.style.visibility = "hidden"; });
        const measured = tags.map((tag, index) => ({ tag, index, w: tag.offsetWidth, h: tag.offsetHeight }))
          .sort((a, b) => b.w * b.h - a.w * a.h);
        const placed: TagBox[] = [];
        measured.forEach(({ tag, index, w, h }) => {
          const pos = findTagPosition(w * 1.12, h * 1.12, placed, ellipse, index + 1);
          if (!pos) { tag.style.visibility = "hidden"; return; }
          placed.push({ x: pos.x, y: pos.y, w: w * 1.12, h: h * 1.12 });
          tag.style.left = `${pos.x}px`;
          tag.style.top = `${pos.y}px`;
          tag.style.visibility = "visible";
          tag.style.setProperty("--tag-rot", `${(seededRandom(index + 42) - 0.5) * 6}deg`);
        });
      }

      function randomPointOutsideEllipse(stageW: number, stageH: number, ellipse: EllipseBounds): Point {
        const pad = 48;
        for (let i = 0; i < 40; i++) {
          const x = pad + Math.random() * (stageW - pad * 2);
          const y = pad + Math.random() * (stageH - pad * 2);
          if (!pointInsideEllipse(x, y, ellipse.cx, ellipse.cy, ellipse.rx - 8, ellipse.ry - 8)) return { x, y };
        }
        return { x: pad, y: pad };
      }

      const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='1.5'%3E%3Cpath d='M8 9l3 3-3 3M13 15h3M5 5h14v14H5z'/%3E%3C/svg%3E";

      function hideFloat() {
        if (!activeFloat) return;
        const el = activeFloat; activeFloat = null;
        gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.2, ease: "power2.in", onComplete: () => el.remove() });
      }

      function showFloat(icon: string, label: string) {
        if (!desktopHover.matches) return;
        hideFloat();
        const rect = stage!.getBoundingClientRect();
        const ellipse = getEllipseBounds();
        const { x, y } = randomPointOutsideEllipse(rect.width, rect.height, ellipse);
        const img = document.createElement("img");
        img.className = "skills-float-icon";
        img.src = skillIconUrl(icon);
        img.alt = label;
        img.draggable = false;
        img.style.left = `${x}px`; img.style.top = `${y}px`;
        img.addEventListener("error", () => { img.src = FALLBACK; });
        floatRoot!.appendChild(img);
        activeFloat = img;
        gsap.fromTo(img, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
      }

      tags.forEach(tag => {
        tag.addEventListener("mouseenter", () => showFloat(tag.dataset.skillIcon ?? "code", tag.dataset.skillLabel ?? tag.textContent ?? "Skill"));
        tag.addEventListener("mouseleave", hideFloat);
        tag.addEventListener("focus", () => { if (desktopHover.matches) showFloat(tag.dataset.skillIcon ?? "code", tag.dataset.skillLabel ?? tag.textContent ?? "Skill"); });
        tag.addEventListener("blur", hideFloat);
      });

      layout();
      requestAnimationFrame(layout);
      window.addEventListener("resize", layout);
    });

    
  }, []);

  return (
    <section id="skills" className="skills" aria-labelledby="skills-heading">
      <canvas id="skills-canvas-gradient" className="skills-canvas skills-canvas--gradient" aria-hidden="true" />
      <div className="skills-inner">
        <h2 id="skills-heading" className="skills-heading">I work with skills</h2>
        <div className="skills-stage" id="skills-stage">
          <div className="skills-eclipse" id="skills-eclipse" aria-hidden="true" />
          <div className="skills-tags" id="skills-tags">
            {ALL_SKILLS.map((skill) => (
              <button
                key={skill.label}
                type="button"
                className="skills-tag"
                data-skill-icon={skill.icon}
                data-skill-label={skill.label}
              >
                {skill.label}
              </button>
            ))}
          </div>
          <div className="skills-float" id="skills-float" aria-hidden="true" />
        </div>
      </div>
      <canvas id="skills-canvas-grain" className="skills-canvas skills-canvas--grain" aria-hidden="true" />
    </section>
  );
}
