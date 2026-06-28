"use client";

import { useEffect } from "react";

export default function CursorEffects() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    const trail = document.getElementById("cursor-gradient-trail") as HTMLDivElement | null;
    if (!hero || !trail) return;

    let targetX = window.innerWidth * 0.5, targetY = window.innerHeight * 0.5;
    let smoothX = targetX, smoothY = targetY;
    let visible = false;
    let raf = 0;
    const lag = 0.035;

    function setVisibility(next: boolean) {
      if (visible === next) return;
      visible = next;
      trail!.style.opacity = visible ? "1" : "0";
    }

    function pointerInHero(cx: number, cy: number) {
      const rect = hero!.getBoundingClientRect();
      return cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
    }

    function onPointerMove(e: PointerEvent) {
      targetX = e.clientX; targetY = e.clientY;
      setVisibility(!pointerInHero(e.clientX, e.clientY));
    }

    function animate() {
      smoothX += (targetX - smoothX) * lag;
      smoothY += (targetY - smoothY) * lag;
      trail!.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", () => setVisibility(false));
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <>
      <div id="cursor-gradient-trail" aria-hidden="true" />
      <div id="cursor-dot" aria-hidden="true" />
    </>
  );
}
