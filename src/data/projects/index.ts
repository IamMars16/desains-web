import type { ImageAsset, Project, SectorId, ServiceId } from "@/types/content";
import { projectImages } from "@/data/generated/images";
import { buildingProjects } from "./edificaciones";
import { constructionProjects } from "./construccion";
import { infrastructureProjects } from "./infraestructura";
import { specialProjects } from "./especiales";
import { sectorLabels, serviceLabels } from "./taxonomy";

export { sectorLabels, serviceLabels };

/** Orden editorial: primero destacados, luego el resto en el orden de cada archivo. */
const all: Project[] = [...specialProjects, ...buildingProjects, ...infrastructureProjects, ...constructionProjects];

export const projects: Project[] = [...all.filter((p) => p.featured), ...all.filter((p) => !p.featured)];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectImages(project: Project): ImageAsset[] {
  return (projectImages[project.slug] ?? []).map((img, i) => ({
    ...img,
    alt: i === 0 ? project.title : `${project.title}, imagen ${i + 1}`,
  }));
}

export function getCover(project: Project): ImageAsset | undefined {
  return getProjectImages(project)[0];
}

export function getAdjacentProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export function getRelatedProjects(project: Project, limit = 3): Project[] {
  return projects
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({
      p,
      score: (p.sector === project.sector ? 2 : 0) + p.services.filter((s) => project.services.includes(s)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count: number;
}

function count<T extends string>(values: T[], labels: Record<string, string>): FilterOption<T>[] {
  const tally = new Map<T, number>();
  values.forEach((v) => tally.set(v, (tally.get(v) ?? 0) + 1));
  return Object.keys(labels)
    .filter((k) => tally.has(k as T))
    .map((k) => ({ value: k as T, label: labels[k], count: tally.get(k as T) ?? 0 }));
}

/** Opciones de filtro con conteo; las categorias sin proyectos no se devuelven. */
export function getFilterOptions() {
  const regions = [...new Set(projects.map((p) => p.region).filter(Boolean) as string[])].sort();
  const years = [...new Set(projects.map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a);
  return {
    services: count<ServiceId>(projects.flatMap((p) => p.services), serviceLabels),
    sectors: count<SectorId>(projects.map((p) => p.sector), sectorLabels),
    regions: regions.map((r) => ({ value: r, label: r, count: projects.filter((p) => p.region === r).length })),
    years: years.map((y) => ({ value: String(y), label: String(y), count: projects.filter((p) => p.year === y).length })),
  };
}
