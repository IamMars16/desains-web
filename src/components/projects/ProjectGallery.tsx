"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/types/content";

/** Galeria con visor accesible (dialog nativo, teclado y foco). */
export function ProjectGallery({ images }: { images: ImageAsset[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 && images.length > 2 ? "sm:col-span-2 lg:row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-xs bg-surface"
              aria-label={`Ampliar imagen: ${img.alt ?? ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt ?? ""}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && setIndex(null)}
        className="m-auto max-h-[92dvh] w-[min(1200px,94vw)] overscroll-contain bg-transparent p-0 text-fg backdrop:bg-canvas-deep/92"
        aria-label="Visor de imágenes"
      >
        {current && (
          <figure className="flex flex-col gap-4">
            <div className="relative h-[72dvh] w-full">
              <Image src={current.src} alt={current.alt ?? ""} fill sizes="94vw" className="object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-4">
              <span className="text-sm text-fg-2">
                {current.alt} <span className="font-mono text-fg-3">({(index ?? 0) + 1}/{images.length})</span>
              </span>
              <span className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => setIndex((i) => ((i ?? 0) - 1 + images.length) % images.length)} aria-label="Imagen anterior" className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong hover:bg-hover">
                      <ArrowLeft size={20} />
                    </button>
                    <button type="button" onClick={() => setIndex((i) => ((i ?? 0) + 1) % images.length)} aria-label="Imagen siguiente" className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong hover:bg-hover">
                      <ArrowRight size={20} />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setIndex(null)} aria-label="Cerrar visor" className="inline-flex size-11 items-center justify-center rounded-xs border border-line-strong hover:bg-hover" autoFocus>
                  <X size={20} />
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
