import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getCover, sectorLabels } from "@/data/projects";
import type { Project } from "@/types/content";

interface Props {
  project: Project;
  sizes?: string;
  priority?: boolean;
  variant?: "default" | "large";
}

export function ProjectCard({ project, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", priority, variant = "default" }: Props) {
  const cover = getCover(project);
  const meta = [project.location, project.year].filter(Boolean).join(", ");
  return (
    <article className="group relative flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-xs bg-surface ${variant === "large" ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt ?? project.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/50 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-steel">{sectorLabels[project.sector]}</p>
        <h3 className={`mt-2 font-semibold leading-snug text-fg ${variant === "large" ? "text-xl md:text-2xl" : "text-lg"}`}>
          <Link href={`/proyectos/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        {meta && <p className="mt-1 text-sm text-fg-3">{meta}</p>}
        <p className="mt-3 line-clamp-2 text-fg-2">{project.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-gold">
          Ver proyecto
          <ArrowUpRight size={16} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
      <span className="pointer-events-none absolute -inset-2 rounded-xs ring-2 ring-focus opacity-0 group-has-[:focus-visible]:opacity-100" aria-hidden="true" />
    </article>
  );
}
