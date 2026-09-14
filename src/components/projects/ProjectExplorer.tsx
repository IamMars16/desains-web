"use client";

import { useSearchParams } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { FilterOption } from "@/data/projects";
import type { Project, SectorId, ServiceId } from "@/types/content";

interface Props {
  projects: Project[];
  options: {
    services: FilterOption<ServiceId>[];
    sectors: FilterOption<SectorId>[];
    regions: FilterOption[];
    years: FilterOption[];
  };
}

type Filters = { servicio: string; tipo: string; region: string; anio: string };

export function ProjectExplorer({ projects, options }: Props) {
  // Filtros enlazables (/proyectos?servicio=bim): la URL es la unica fuente de verdad.
  const params = useSearchParams();
  const filters: Filters = {
    servicio: params.get("servicio") ?? "",
    tipo: params.get("tipo") ?? "",
    region: params.get("region") ?? "",
    anio: params.get("anio") ?? "",
  };

  const update = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    const q = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && q.set(k, v));
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const { servicio, tipo, region, anio } = filters;
  const results = projects.filter(
    (p) =>
      (!servicio || p.services.includes(servicio as ServiceId)) &&
      (!tipo || p.sector === tipo) &&
      (!region || p.region === region) &&
      (!anio || String(p.year) === anio),
  );

  const active = Object.values(filters).some(Boolean);
  const selects: { key: keyof Filters; label: string; opts: FilterOption[] }[] = [
    { key: "tipo", label: "Tipo de proyecto", opts: options.sectors },
    { key: "region", label: "Ubicación", opts: options.regions },
    { key: "anio", label: "Año", opts: options.years },
  ];

  return (
    <div className="container-site py-12 md:py-16">
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="text-sm font-semibold text-fg">Servicio</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {[{ value: "", label: "Todos", count: projects.length }, ...options.services].map((o) => {
              const on = filters.servicio === o.value;
              return (
                <button
                  key={o.value || "todos"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update("servicio", o.value)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xs border px-4 text-sm transition-colors ${
                    on ? "border-gold bg-gold text-on-gold" : "border-line-strong text-fg-2 hover:bg-hover hover:text-fg"
                  }`}
                >
                  {o.label}
                  <span className={`font-mono text-xs ${on ? "text-on-gold/75" : "text-fg-3"}`}>{o.count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-end gap-4">
          {selects
            .filter((s) => s.opts.length > 1)
            .map((s) => (
              <div key={s.key} className="flex min-w-48 flex-col gap-2">
                <label htmlFor={`f-${s.key}`} className="text-sm font-semibold text-fg">
                  {s.label}
                </label>
                <select
                  id={`f-${s.key}`}
                  value={filters[s.key]}
                  onChange={(e) => update(s.key, e.target.value)}
                  className="min-h-11 rounded-xs border border-line-strong bg-surface px-3 text-fg"
                >
                  <option value="">Todos</option>
                  {s.opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label} ({o.count})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          {active && (
            <button
              type="button"
              onClick={() => window.history.replaceState(null, "", window.location.pathname)}
              className="min-h-11 px-2 text-sm font-medium text-gold underline-offset-4 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mt-10 text-fg-2" aria-live="polite">
        {results.length === 1 ? "1 proyecto" : `${results.length} proyectos`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <li key={p.slug} className="[contain-intrinsic-size:auto_460px] [content-visibility:auto]">
              <ProjectCard project={p} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-xs border border-line bg-surface p-10">
          <p className="text-lg font-semibold text-fg">No hay proyectos con esta combinación de filtros.</p>
          <p className="mt-2 text-fg-2">Pruebe con otro servicio o quite alguno de los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}
