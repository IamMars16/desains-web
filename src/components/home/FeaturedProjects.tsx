"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Slider horizontal con scroll-snap, botones y teclado. Los extremos se detectan con IntersectionObserver. */
export function FeaturedSlider({ children, count }: { children: ReactNode; count: number }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = el.querySelectorAll(":scope > li");
    const first = items[0];
    const last = items[items.length - 1];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === first) setEdges((s) => ({ ...s, start: e.intersectionRatio > 0.95 }));
          if (e.target === last) setEdges((s) => ({ ...s, end: e.intersectionRatio > 0.95 }));
        });
      },
      { root: el, threshold: [0, 0.95, 1] },
    );
    if (first) io.observe(first);
    if (last) io.observe(last);
    return () => io.disconnect();
  }, [count]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(":scope > li");
    const step = item ? item.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="container-site mb-8 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={edges.start}
          aria-label="Proyecto anterior"
          aria-controls="slider-proyectos"
          className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong text-fg transition-colors hover:bg-hover disabled:opacity-35"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={edges.end}
          aria-label="Proyecto siguiente"
          aria-controls="slider-proyectos"
          className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong text-fg transition-colors hover:bg-hover disabled:opacity-35"
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <ul
        id="slider-proyectos"
        ref={track}
        aria-label="Proyectos destacados"
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-6 [scrollbar-width:thin] md:px-10 xl:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]"
      >
        {children}
      </ul>
    </div>
  );
}
