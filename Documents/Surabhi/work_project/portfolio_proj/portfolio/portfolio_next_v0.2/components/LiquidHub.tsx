"use client";

import { useEffect } from "react";
import { SCHEME_1_DEFAULTS } from "@/lib/liquid/liquid-gradient";

export default function LiquidHub() {
  useEffect(() => {
    
    let effectDispose: (() => void) | undefined;

    Promise.all([
      import("@/lib/effects/noiseGradient"),
      import("@/lib/liquid/liquid-gradient"),
      import("@/lib/liquid/liquid-hub-code"),
    ]).then(([{ initNoiseGradientSection }, { createLiquidGradientEffect }, { buildLiquidExportBundle }]) => {
      const root = document.getElementById("liquid-hub");
      const frame = document.getElementById("liquid-hub-demo-frame");
      const mount = document.getElementById("liquid-hub-demo-mount");
      if (!root || !frame || !mount) return;

      initNoiseGradientSection(root, "liquid-hub-canvas-gradient", "liquid-hub-canvas-grain");

      const effect = createLiquidGradientEffect(frame, mount);
      effectDispose = () => effect.dispose();
      let activeCodeTab = "html";

      function refreshCode() {
        const bundle = buildLiquidExportBundle(effect.getColorState());
        const map: Record<string, string> = { html: bundle.html, css: bundle.css, js: bundle.js, all: bundle.all };
        Object.entries(map).forEach(([key, value]) => {
          const panel = root!.querySelector<HTMLElement>(`#liquid-hub-code-${key} code`);
          if (panel) panel.textContent = value;
        });
        root!.dataset.activeCodeTab = activeCodeTab;
        root!.dataset.activeCode = map[activeCodeTab] ?? bundle.html;
      }

      refreshCode();

      const panel = document.getElementById("liquid-hub-color-panel");
      const toggleBtn = document.getElementById("liquid-hub-adjust-toggle");
      const closeBtn = document.getElementById("liquid-hub-color-close");
      const resetBtn = document.getElementById("liquid-hub-reset-colors");

      toggleBtn?.addEventListener("click", () => { panel?.removeAttribute("hidden"); toggleBtn.setAttribute("hidden", ""); });
      closeBtn?.addEventListener("click", () => { panel?.setAttribute("hidden", ""); toggleBtn?.removeAttribute("hidden"); });
      resetBtn?.addEventListener("click", () => {
        effect.applyScheme1();
        const basePicker = root.querySelector<HTMLInputElement>("#liquid-color-base");
        const baseDisplay = root.querySelector<HTMLInputElement>("#liquid-color-value-base");
        if (basePicker) basePicker.value = SCHEME_1_DEFAULTS.darkNavy.toLowerCase();
        if (baseDisplay) baseDisplay.value = SCHEME_1_DEFAULTS.darkNavy.toUpperCase();
        SCHEME_1_DEFAULTS.colors.forEach((hex, i) => {
          const picker = root.querySelector<HTMLInputElement>(`#liquid-color-${i + 1}`);
          const display = root.querySelector<HTMLInputElement>(`#liquid-color-value-${i + 1}`);
          if (picker) picker.value = hex.toLowerCase();
          if (display) display.value = hex.toUpperCase();
        });
        refreshCode();
      });

      root.querySelectorAll<HTMLInputElement>(".liquid-hub-color-input").forEach((picker) => {
        picker.addEventListener("input", () => {
          if (picker.dataset.colorRole === "base") {
            const display = root.querySelector<HTMLInputElement>("#liquid-color-value-base");
            effect.setBaseColor(picker.value);
            if (display) display.value = picker.value.toUpperCase();
          } else {
            const index = Number(picker.dataset.colorIndex);
            const display = root.querySelector<HTMLInputElement>(`#liquid-color-value-${index}`);
            effect.setColor(index, picker.value);
            if (display) display.value = picker.value.toUpperCase();
          }
          refreshCode();
        });
      });

      root.querySelectorAll<HTMLButtonElement>(".liquid-hub-color-copy").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const idx = btn.dataset.copyColor;
          const display = root.querySelector<HTMLInputElement>(`#liquid-color-value-${idx}`);
          if (!display) return;
          try {
            await navigator.clipboard.writeText(display.value);
            const orig = btn.textContent ?? "";
            btn.textContent = "Copied!"; btn.classList.add("is-copied");
            window.setTimeout(() => { btn.textContent = orig; btn.classList.remove("is-copied"); }, 2000);
          } catch { btn.textContent = "Copy failed"; }
        });
      });

      root.querySelectorAll<HTMLButtonElement>(".liquid-hub-code-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          activeCodeTab = tab.dataset.codeTab ?? "html";
          root.querySelectorAll(".liquid-hub-code-tab").forEach(el => el.classList.remove("is-active"));
          root.querySelectorAll(".liquid-hub-code-panel").forEach(el => el.classList.remove("is-active"));
          tab.classList.add("is-active");
          root.querySelector(`[data-code-panel="${activeCodeTab}"]`)?.classList.add("is-active");
          refreshCode();
        });
      });

      const copyActiveBtn = document.getElementById("liquid-hub-copy-active");
      copyActiveBtn?.addEventListener("click", async () => {
        const text = root.dataset.activeCode ?? "";
        try {
          await navigator.clipboard.writeText(text);
          const orig = (copyActiveBtn as HTMLButtonElement).textContent ?? "";
          (copyActiveBtn as HTMLButtonElement).textContent = "Copied!";
          (copyActiveBtn as HTMLButtonElement).classList.add("is-copied");
          window.setTimeout(() => { (copyActiveBtn as HTMLButtonElement).textContent = orig; (copyActiveBtn as HTMLButtonElement).classList.remove("is-copied"); }, 2000);
        } catch {}
      });
    });

    return () => {
      effectDispose?.();
    };
  }, []);

  const codeTabs = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "js", label: "JavaScript" },
    { id: "all", label: "All" },
  ];

  return (
    <section id="liquid-hub" className="liquid-hub" aria-labelledby="liquid-hub-heading">
      <canvas id="liquid-hub-canvas-gradient" className="liquid-hub-canvas liquid-hub-canvas--gradient" aria-hidden="true" />
      <div className="liquid-hub-inner">
        <header className="liquid-hub-header">
          <h1 id="liquid-hub-heading" className="liquid-hub-heading">Liquid Hub</h1>
          <p className="liquid-hub-subheading">
            Interactive liquid gradient on white — Puddle Jumper, Thistle Down, Dusty Lavender, Cupid&apos;s Arrow, Lolly, and Peachade. Move over the preview to ripple the surface.
          </p>
        </header>

        <article className="liquid-hub-demo-card" aria-label="Liquid gradient preview">
          <div className="liquid-hub-demo-frame" id="liquid-hub-demo-frame">
            <div className="liquid-hub-demo-mount" id="liquid-hub-demo-mount" />
            <div className="liquid-hub-demo-overlay">
              <span className="liquid-hub-scheme-badge">Palette</span>
              <button type="button" className="liquid-hub-adjust-btn" id="liquid-hub-adjust-toggle">Adjust Colors</button>
              <div className="liquid-hub-color-panel" id="liquid-hub-color-panel" hidden>
                <div className="liquid-hub-color-panel-head">
                  <h2 className="liquid-hub-color-panel-title">Custom Colors</h2>
                  <button type="button" className="liquid-hub-color-panel-close" id="liquid-hub-color-close" aria-label="Close color panel">×</button>
                </div>
                {/* Base color */}
                <div className="liquid-hub-color-group liquid-hub-color-group--base">
                  <label className="liquid-hub-color-label" htmlFor="liquid-color-base">Base color</label>
                  <div className="liquid-hub-color-row">
                    <input type="color" className="liquid-hub-color-input" id="liquid-color-base" data-color-role="base" defaultValue={SCHEME_1_DEFAULTS.darkNavy.toLowerCase()} />
                    <input type="text" className="liquid-hub-color-value" id="liquid-color-value-base" defaultValue={SCHEME_1_DEFAULTS.darkNavy.toUpperCase()} readOnly />
                    <button type="button" className="liquid-hub-color-copy" data-copy-color="base">Copy</button>
                  </div>
                </div>
                {/* Color pickers */}
                {SCHEME_1_DEFAULTS.colors.map((hex, i) => (
                  <div key={i} className="liquid-hub-color-group">
                    <label className="liquid-hub-color-label" htmlFor={`liquid-color-${i + 1}`}>Color {i + 1}</label>
                    <div className="liquid-hub-color-row">
                      <input type="color" className="liquid-hub-color-input" id={`liquid-color-${i + 1}`} data-color-index={i + 1} defaultValue={hex.toLowerCase()} />
                      <input type="text" className="liquid-hub-color-value" id={`liquid-color-value-${i + 1}`} defaultValue={hex.toUpperCase()} readOnly />
                      <button type="button" className="liquid-hub-color-copy" data-copy-color={i + 1}>Copy</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="liquid-hub-reset-btn" id="liquid-hub-reset-colors">Reset to defaults</button>
              </div>
            </div>
          </div>
        </article>

        <section className="liquid-hub-code" aria-labelledby="liquid-hub-code-heading">
          <div className="liquid-hub-code-head">
            <h2 id="liquid-hub-code-heading" className="liquid-hub-code-heading">Copy the code</h2>
            <button type="button" className="liquid-hub-code-copy-btn" id="liquid-hub-copy-active">Copy snippet</button>
          </div>
          <div className="liquid-hub-code-tabs">
            {codeTabs.map((tab, i) => (
              <button key={tab.id} type="button" className={`liquid-hub-code-tab${i === 0 ? " is-active" : ""}`} data-code-tab={tab.id}>{tab.label}</button>
            ))}
          </div>
          <div className="liquid-hub-code-panels">
            {codeTabs.map((tab, i) => (
              <pre key={tab.id} className={`liquid-hub-code-panel${i === 0 ? " is-active" : ""}`} id={`liquid-hub-code-${tab.id}`} data-code-panel={tab.id}><code /></pre>
            ))}
          </div>
          <p className="liquid-hub-code-note">
            Based on{" "}
            <a href="https://codepen.io/cameronknight/pen/ogxWmBP" target="_blank" rel="noopener noreferrer">
              Interactive Liquid Gradient
            </a>{" "}
            by Cameron Knight — exported with your current colors.
          </p>
        </section>
      </div>
      <canvas id="liquid-hub-canvas-grain" className="liquid-hub-canvas liquid-hub-canvas--grain" aria-hidden="true" />
    </section>
  );
}
