"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "@phosphor-icons/react";
import { createTimeline, type Timeline } from "animejs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ctaLabels } from "@/config/navigation";
import { heroChapters, heroIntro, heroRail } from "@/data/home/hero";
import { hasWebGL, useHydrated, useIsMobile, useReducedMotion } from "@/lib/use-client-env";

const BuildingCanvas = dynamic(() => import("@/components/three/building/BuildingCanvas"), { ssr: false });

const TL = 1000;
/** Tramos [entrada, salida] de cada capitulo en milesimas del scroll. */
const WINDOWS: [number, number][] = [
  [180, 360],
  [380, 600],
  [610, 790],
  [810, 1000],
];

export function HeroExperience() {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const [active, setActive] = useState(true);
  const webgl = hydrated && hasWebGL();

  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const chapters = useRef<(HTMLDivElement | null)[]>([]);
  const railFill = useRef<HTMLSpanElement>(null);
  const railItems = useRef<(HTMLLIElement | null)[]>([]);
  const timeline = useRef<Timeline | null>(null);
  const uiVisible = useRef<boolean | null>(null);

  // Pausa el render 3D cuando el hero no esta en pantalla.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Linea de tiempo de textos controlada por el scroll (se posiciona con seek).
  useEffect(() => {
    if (reduce || !intro.current) return;
    const tl = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" } });
    tl.add(intro.current, { opacity: { from: 1, to: 0 }, translateY: { from: 0, to: -40 }, duration: 110 }, 90);
    chapters.current.forEach((el, i) => {
      if (!el) return;
      const [a, b] = WINDOWS[i];
      tl.add(el, { opacity: { from: 0, to: 1 }, translateY: { from: 36, to: 0 }, duration: 70 }, a);
      if (b < TL) tl.add(el, { opacity: 0, translateY: -36, duration: 60 }, b - 60);
    });
    tl.seek(0);
    timeline.current = tl;
    return () => {
      tl.revert();
      timeline.current = null;
    };
  }, [reduce]);

  // La barra y el boton de WhatsApp aparecen al avanzar el hero.
  useEffect(() => {
    if (reduce) return;
    document.documentElement.dataset.heroUi = "hidden";
    uiVisible.current = false;
    return () => {
      delete document.documentElement.dataset.heroUi;
    };
  }, [reduce]);

  const getProgress = useCallback(() => {
    const el = section.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const range = r.height - window.innerHeight;
    return range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
  }, []);

  const onFrame = useCallback((p: number) => {
    timeline.current?.seek(p * TL);
    // Los textos invisibles no deben recibir foco de teclado.
    const t = p * TL;
    const setInert = (el: HTMLElement | null, hidden: boolean) => {
      if (el && el.inert !== hidden) el.inert = hidden;
    };
    setInert(intro.current, t > 150);
    chapters.current.forEach((el, i) => setInert(el, t < WINDOWS[i][0] || (WINDOWS[i][1] < TL && t > WINDOWS[i][1] - 30)));
    if (railFill.current) railFill.current.style.transform = `scaleY(${p})`;
    const phase = p < 0.4 ? 0 : p < 0.8 ? 1 : 2;
    railItems.current.forEach((li, i) => li?.toggleAttribute("data-active", i === phase));
    const show = p > 0.04;
    if (show !== uiVisible.current) {
      uiVisible.current = show;
      document.documentElement.dataset.heroUi = show ? "visible" : "hidden";
    }
  }, []);

  // Sin WebGL no hay bucle de render 3D: los textos siguen el scroll con requestAnimationFrame.
  useEffect(() => {
    if (!hydrated || webgl || reduce) return;
    let raf = 0;
    const loop = () => {
      onFrame(getProgress());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hydrated, webgl, reduce, onFrame, getProgress]);

  const introBlock = (
    <div className="max-w-xl">
      <p className="font-expanded text-sm font-semibold tracking-[0.2em] text-gold">{heroIntro.brand.toUpperCase()}</p>
      <h1 className="font-semi-expanded mt-5 text-4xl font-bold leading-[1.05] text-fg md:text-5xl lg:text-6xl">
        {heroIntro.title}
      </h1>
      <p className="mt-6 max-w-md text-lg text-fg-2">{heroIntro.subtitle}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ButtonLink href="/proyectos" icon={<ArrowRight size={18} weight="bold" />}>
          {ctaLabels.projects}
        </ButtonLink>
        <ButtonLink href="/profesionales" variant="secondary">
          {ctaLabels.team}
        </ButtonLink>
      </div>
    </div>
  );

  // ----- Movimiento reducido: hero estatico y capitulos legibles en su estado final -----
  if (hydrated && reduce) {
    return (
      <section aria-label="Presentación" className="relative border-b border-line">
        <div className="relative min-h-[100dvh] overflow-hidden">
          {webgl && (
            <BuildingCanvas active mobile={mobile} staticPose={0.58} getProgress={() => 0.58} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-transparent" />
          <div className="container-site relative flex min-h-[100dvh] items-center pb-16 pt-28">{introBlock}</div>
        </div>
        <ol className="container-site grid gap-10 py-20 md:grid-cols-2 lg:grid-cols-4">
          {heroChapters.map((c) => (
            <li key={c.id}>
              <h2 className="font-semi-expanded text-xl font-semibold text-fg">{c.title}</h2>
              <p className="mt-3 text-fg-2">{c.body}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={section} aria-label="Presentación: de la arquitectura a la estructura" className="relative h-[520vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {webgl ? (
          <BuildingCanvas active={active} mobile={mobile} getProgress={getProgress} onFrame={onFrame} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,#15233a_0%,#0a0f17_60%)]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas from-25% via-canvas/60 via-50% to-transparent md:bg-gradient-to-r md:from-canvas/85 md:from-0% md:via-canvas/20 md:to-transparent" />

        <div className="container-site relative flex h-full items-start pt-28 md:items-center md:pt-0">
          <div ref={intro} className="w-full">
            {introBlock}
          </div>
        </div>

        {heroChapters.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              chapters.current[i] = el;
            }}
            style={{ opacity: 0 }}
            inert
            className="container-site pointer-events-none absolute inset-x-0 top-24 md:top-1/2 md:-translate-y-1/2"
          >
            <div className="pointer-events-auto max-w-md">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{c.rail}</p>
              <h2 className="font-semi-expanded mt-3 text-3xl font-bold leading-tight text-fg md:text-4xl">{c.title}</h2>
              <p className="mt-4 text-lg text-fg-2">{c.body}</p>
              {c.legend && (
                <ul className="mt-6 grid gap-2.5">
                  {c.legend.map((l) => (
                    <li key={l.label} className="flex items-center gap-3 text-fg">
                      <span className="size-3 rounded-xs" style={{ background: l.color }} aria-hidden="true" />
                      {l.label}
                    </li>
                  ))}
                </ul>
              )}
              {c.link && (
                <a
                  href={c.link.href}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-gold underline-offset-8 hover:underline"
                >
                  {c.link.label}
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        ))}

        <div aria-hidden="true" className="absolute bottom-24 right-5 hidden md:block lg:right-10">
          <ol className="relative flex flex-col gap-4 pl-5">
            <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-line" aria-hidden="true">
              <span ref={railFill} className="block h-full w-px origin-top scale-y-0 bg-gold" />
            </span>
            {heroRail.map((label, i) => (
              <li
                key={label}
                ref={(el) => {
                  railItems.current[i] = el;
                }}
                data-active={i === 0 ? "" : undefined}
                className="font-mono text-xs uppercase tracking-[0.16em] text-fg-3 transition-colors data-[active]:text-fg"
              >
                {label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
