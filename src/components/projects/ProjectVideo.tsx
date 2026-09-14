"use client";

import { useEffect, useRef } from "react";
import type { ProjectVideo as Video } from "@/types/content";

/** Video con poster, sin precarga y pausado automaticamente fuera de pantalla. */
export function ProjectVideo({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !el.paused) el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className="aspect-video w-full rounded-xs bg-surface"
      controls
      playsInline
      preload="none"
      poster={video.poster}
      aria-label={video.title}
    >
      <source src={video.src} type="video/mp4" />
    </video>
  );
}
