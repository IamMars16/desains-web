"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "article" | "header" | "figure";
  className?: string;
  /** Anima los hijos directos en cascada en lugar del contenedor. */
  group?: boolean;
  delay?: number;
  id?: string;
}

/**
 * Revela contenido al entrar en pantalla (IntersectionObserver + Anime.js).
 * Sin JS o con movimiento reducido el contenido se muestra directamente.
 */
export function Reveal({ children, as = "div", className, group = false, delay = 0, id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.documentElement.dataset.motion !== "on") {
      el.dataset.revealed = "";
      return;
    }
    const targets = group ? Array.from(el.children) : [el];
    if (group) targets.forEach((t) => ((t as HTMLElement).style.opacity = "0"));

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.dataset.revealed = "";
        animate(targets, {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 900,
          delay: group ? stagger(80, { start: delay }) : delay,
          ease: "outExpo",
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [group, delay]);

  return (
    <Tag ref={ref} className={className} data-reveal="" id={id}>
      {children}
    </Tag>
  );
}
