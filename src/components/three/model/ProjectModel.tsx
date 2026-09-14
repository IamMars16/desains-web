"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Cube } from "@phosphor-icons/react";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <div className="aspect-[16/10] w-full animate-pulse rounded-xs bg-surface" />,
});

/** El visor 3D (Three.js) solo se descarga cuando el usuario pide ver el modelo. */
export function ProjectModel({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <ModelViewer src={src} title={title} />;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex min-h-12 items-center gap-3 rounded-xs border border-line-strong px-5 font-semibold text-fg hover:bg-hover"
    >
      <Cube size={22} aria-hidden="true" />
      Ver modelo 3D
    </button>
  );
}
