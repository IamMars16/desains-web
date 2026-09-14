"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { animate, stagger } from "animejs";
import { Logo } from "@/components/brand/Logo";
import { contactNav, ctaLabels, mainNav } from "@/config/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Fondo solido cuando el centinela superior sale de pantalla (sin listeners de scroll).
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const links = panelRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]");
    links?.[0]?.focus();
    if (links && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animate(links, { opacity: [0, 1], translateY: [18, 0], delay: stagger(45), duration: 600, ease: "outExpo" });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,opacity,transform] duration-500 ${
        solid || open ? "border-b border-line bg-canvas/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Link href="/" className="rounded-xs" aria-label="DESAINS Ingenieros, inicio">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative py-2 text-[0.92rem] transition-colors hover:text-fg ${
                    isActive(item.href) ? "text-fg after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gold" : "text-fg-2"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={contactNav.href}
            className="hidden min-h-11 items-center rounded-xs bg-gold px-4 text-[0.9rem] font-semibold text-on-gold transition-colors hover:bg-gold-hover sm:inline-flex"
          >
            {ctaLabels.start}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-canvas pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <nav aria-label="Menú móvil" className="container-site flex flex-col gap-1 py-8" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
            {[...mainNav, contactNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-menu-item=""
                aria-current={isActive(item.href) ? "page" : undefined}
                className="font-expanded border-b border-line py-4 text-2xl font-semibold text-fg"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={contactNav.href}
              data-menu-item=""
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xs bg-gold px-5 font-semibold text-on-gold"
            >
              {ctaLabels.start}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
