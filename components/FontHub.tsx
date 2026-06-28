"use client";

import { useEffect } from "react";
import {
  FONT_HUB_CARDS,
  getAllFontsFromCards,
  getCardById,
  getCardLabel,
  getFontsFromCard,
  getPreviewText,
  type FontHubCard,
  type FontInfo,
} from "@/data/fonts";

const MODAL_CLOSE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
  </svg>
);

function cardPreviewLines(card: FontHubCard) {
  const fonts = getFontsFromCard(card);
  if (fonts.length === 1) {
    return (
      <span className="font-hub-card-preview-line font-hub-card-preview-line--solo" style={{ fontFamily: `'${fonts[0].family}', cursive, serif` }}>
        {getPreviewText(fonts[0])}
      </span>
    );
  }
  return fonts.map((font, i) => (
    <span key={i} className={`font-hub-card-preview-line${i === 0 ? " font-hub-card-preview-line--primary" : ""}`} style={{ fontFamily: `'${font.family}', cursive, serif` }}>
      {getPreviewText(font)}
    </span>
  ));
}

export default function FontHub() {
  useEffect(() => {
    

    import("@/lib/effects/noiseGradient").then(({ initNoiseGradientSection }) => {
      const root = document.getElementById("font-hub");
      const modal = document.getElementById("font-hub-modal");
      const backdrop = document.getElementById("font-hub-modal-backdrop");
      const closeBtn = document.getElementById("font-hub-modal-close");
      const previewEl = document.getElementById("font-hub-modal-preview");
      const titleEl = document.getElementById("font-hub-modal-title");
      const fontsPanelEl = document.getElementById("font-hub-modal-fonts");
      const tagsEl = document.getElementById("font-hub-modal-tags");

      if (!root || !modal || !backdrop || !closeBtn || !previewEl || !titleEl || !fontsPanelEl || !tagsEl) return;

      initNoiseGradientSection(root, "font-hub-canvas-gradient", "font-hub-canvas-grain");

      // Load Google Fonts once
      if (!document.getElementById("font-hub-google-fonts")) {
        const allFonts = getAllFontsFromCards(FONT_HUB_CARDS);
        const uniqueParams = [...new Set(allFonts.map(f => f.googleParam))];
        const families = uniqueParams.map(p => `family=${p}`).join("&");
        const link = document.createElement("link");
        link.id = "font-hub-google-fonts";
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
        document.head.appendChild(link);
      }

      if (modal.parentElement !== document.body) document.body.appendChild(modal);

      function openModal(cardId: string) {
        const card = getCardById(cardId);
        if (!card) return;
        const fonts = getFontsFromCard(card);
        titleEl!.textContent = getCardLabel(card);
        previewEl!.innerHTML = fonts.map((f, i) => `<div class="font-hub-modal-preview-line${i === 0 ? " font-hub-modal-preview-line--primary" : ""}" style="font-family:'${f.family}',cursive,serif">${getPreviewText(f)}</div>`).join("");
        fontsPanelEl!.innerHTML = fonts.map(f => `
          <div class="font-hub-modal-font-block">
            <h3 class="font-hub-modal-font-name">${f.name}</h3>
            <div class="font-hub-meta">
              ${[["Family",f.family],["Category",f.category],["Style",f.style],["Weight",String(f.weight)],["Italic",f.italic?"Yes":"No"],["Variable",f.variable?"Yes":"No"],["Designer",f.designer],["License",f.license],["Subsets",f.subsets.join(", ")],["Source",f.source]].map(([l,v])=>`<div class="font-hub-meta-row"><dt>${l}</dt><dd>${v}</dd></div>`).join("")}
            </div>
            <a class="font-hub-download-btn" href="${f.download}" target="_blank" rel="noopener noreferrer">Download ${f.name}</a>
          </div>`).join("");
        tagsEl!.innerHTML = card.tags.map(t => `<span class="font-hub-tag">${t}</span>`).join("");
        modal!.hidden = false;
        modal!.setAttribute("aria-hidden", "false");
        document.body.classList.add("font-hub-modal-open");
        closeBtn!.focus();
      }

      function closeModal() {
        modal!.hidden = true;
        modal!.setAttribute("aria-hidden", "true");
        document.body.classList.remove("font-hub-modal-open");
      }

      root.querySelectorAll<HTMLButtonElement>(".font-hub-view-btn").forEach(btn => {
        btn.addEventListener("click", () => { if (btn.dataset.cardId) openModal(btn.dataset.cardId); });
      });
      closeBtn.addEventListener("click", closeModal);
      backdrop.addEventListener("click", closeModal);
      window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal!.hidden) closeModal(); });
    });

    
  }, []);

  return (
    <>
      <section id="font-hub" className="font-hub" aria-labelledby="font-hub-heading">
        <canvas id="font-hub-canvas-gradient" className="font-hub-canvas font-hub-canvas--gradient" aria-hidden="true" />
        <div className="font-hub-inner">
          <h1 id="font-hub-heading" className="font-hub-heading">My favourite font to use</h1>
          <div className="font-hub-grid">
            {FONT_HUB_CARDS.map((card) => {
              const fonts = getFontsFromCard(card);
              return (
                <article key={card.id} className="font-hub-card" data-card-id={card.id}>
                  <div className="font-hub-card-frame">
                    <div className="font-hub-card-preview" aria-hidden="true">
                      {cardPreviewLines(card)}
                    </div>
                    <div className="font-hub-card-actions">
                      <div className="font-hub-card-label">
                        <span className="font-hub-card-name">{getCardLabel(card)}</span>
                        {fonts.length > 1 && <span className="font-hub-card-count">{fonts.length} fonts</span>}
                      </div>
                      <button type="button" className="font-hub-view-btn" data-card-id={card.id}>View</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <canvas id="font-hub-canvas-grain" className="font-hub-canvas font-hub-canvas--grain" aria-hidden="true" />
      </section>

      {/* Modal — moved to body by useEffect */}
      <div className="font-hub-modal" id="font-hub-modal" hidden aria-hidden="true">
        <div className="font-hub-modal-backdrop" id="font-hub-modal-backdrop" />
        <div className="font-hub-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="font-hub-modal-title">
          <button type="button" className="font-hub-modal-close" id="font-hub-modal-close" aria-label="Close">
            {MODAL_CLOSE_SVG}
          </button>
          <div className="font-hub-modal-top">
            <div className="font-hub-modal-preview" id="font-hub-modal-preview" aria-hidden="true" />
            <div className="font-hub-modal-panel">
              <h2 className="font-hub-modal-title" id="font-hub-modal-title" />
              <div className="font-hub-modal-fonts" id="font-hub-modal-fonts" />
            </div>
          </div>
          <div className="font-hub-modal-tags" id="font-hub-modal-tags" />
        </div>
      </div>
    </>
  );
}
