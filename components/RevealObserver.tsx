"use client";

import { useEffect } from "react";

/**
 * Anime les éléments `.reveal`/`.reveal-left`/`.reveal-right` au scroll.
 * Isolé en petit composant client pour que app/[locale]/page.tsx reste un
 * composant serveur (budget de performance, section 10).
 */
export default function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
