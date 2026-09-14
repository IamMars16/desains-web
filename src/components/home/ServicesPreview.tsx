"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useState } from "react";
import type { Service } from "@/types/content";

/** Lista de servicios con vista previa de imagen al pasar el cursor o enfocar. */
export function ServicesPreview({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
      <ul className="border-t border-line">
        {services.map((s, i) => (
          <li key={s.id} className="border-b border-line">
            <Link
              href={`/servicios#${s.id}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[1fr_auto] items-start gap-4 py-6"
              aria-describedby={`srv-${s.id}`}
            >
              <span>
                <span
                  className={`font-semi-expanded block text-xl font-semibold transition-colors md:text-2xl ${
                    i === active ? "text-fg" : "text-fg-2"
                  }`}
                >
                  {s.name}
                </span>
                <span id={`srv-${s.id}`} className="mt-2 block max-w-[52ch] text-fg-3">
                  {s.summary}
                </span>
              </span>
              <ArrowUpRight
                size={22}
                aria-hidden="true"
                className={`mt-1 transition-all ${i === active ? "text-gold" : "text-fg-3"} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative hidden lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-xs bg-surface">
          {services.map((s, i) => (
            <Image
              key={s.id}
              src={s.image.src}
              alt={i === active ? (s.image.alt ?? s.name) : ""}
              aria-hidden={i !== active}
              fill
              sizes="40vw"
              className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 to-transparent p-6 pt-24">
            <p className="text-sm text-fg-2">{current.image.alt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
