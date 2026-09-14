"use client";

import { animate, stagger, svg } from "animejs";
import { useEffect, useMemo, useRef } from "react";

type Kind = "signal" | "probabilistic" | "match";

/** Graficos ilustrativos (no datos reales) que explican que hace cada programa. */
function build(kind: Kind) {
  const W = 320;
  const H = 150;
  if (kind === "signal") {
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = (i / 240) * W;
      const env = Math.exp(-Math.pow((i - 70) / 45, 2)) * 0.9 + 0.08;
      const y = H / 2 + Math.sin(i * 0.9) * Math.cos(i * 0.23) * env * (H * 0.42);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return { W, H, paths: [{ d: `M${pts.join("L")}`, accent: true }] };
  }
  if (kind === "probabilistic") {
    const paths = Array.from({ length: 7 }, (_, k) => {
      const cap = 0.45 + k * 0.08;
      const pts: string[] = [];
      for (let i = 0; i <= 40; i++) {
        const drift = i / 40;
        const im = Math.min(1, (drift * (1.2 + k * 0.1)) / (1 + Math.pow(drift / cap, 6)));
        pts.push(`${(drift * W).toFixed(1)},${(H - 8 - im * (H - 24)).toFixed(1)}`);
      }
      return { d: `M${pts.join("L")}`, accent: k === 3 };
    });
    return { W, H, paths };
  }
  const paths = Array.from({ length: 6 }, (_, k) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const target = 0.9 * Math.exp(-Math.pow((t - 0.18) / 0.12, 2)) + 0.55 * Math.exp(-t * 2.2);
      const noise = k === 0 ? 0 : Math.sin(i * (0.7 + k * 0.13) + k) * 0.18 * (1 - t * 0.5);
      pts.push(`${(t * W).toFixed(1)},${(H - 10 - (target + noise) * (H * 0.62)).toFixed(1)}`);
    }
    return { d: `M${pts.join("L")}`, accent: k === 0 };
  });
  return { W, H, paths };
}

export function SofipsGraphic({ kind }: { kind: Kind }) {
  const ref = useRef<SVGSVGElement>(null);
  const data = useMemo(() => build(kind), [kind]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = svg.createDrawable(el.querySelectorAll("path"), 0, 0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      animate(lines, { draw: ["0 0", "0 1"], duration: 1600, delay: stagger(90), ease: "inOutQuad" });
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} viewBox={`0 0 ${data.W} ${data.H}`} className="h-auto w-full" aria-hidden="true" focusable="false">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={data.W} y1={data.H * g} y2={data.H * g} stroke="var(--color-line)" strokeWidth="1" />
      ))}
      {data.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.accent ? "var(--color-gold)" : "var(--color-steel)"}
          strokeOpacity={p.accent ? 1 : 0.45}
          strokeWidth={p.accent ? 1.8 : 1.1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
