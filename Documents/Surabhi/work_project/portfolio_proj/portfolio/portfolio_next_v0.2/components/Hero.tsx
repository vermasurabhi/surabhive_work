"use client";

import { useEffect } from "react";

export default function Hero() {
  useEffect(() => {
    import("@/lib/effects/noiseGradient").then(({ initHeroEffects }) => {
      initHeroEffects();
    });
  }, []);

  return (
    <div id="hero">
      <canvas id="canvas-gradient" aria-hidden="true" />
      <div id="webgl_wrapper" aria-hidden="true" />
      <div id="content-stack">
        <h1 id="title">
          <span className="title-line" id="line1">SURABHI VERMA</span>
          <span className="title-line" id="line2">WEB DEVELOPER</span>
        </h1>
        <p className="hint">
          CLICK ANYWHERE TO ADD COLOR.
          <br />
          SCROLL TO CONTINUE.
        </p>
      </div>
      <canvas id="canvas-grain" aria-hidden="true" />
    </div>
  );
}
