export interface ScenePalette {
  canvas: string;
  navy: string;
  architecture: string;
  glass: string;
  structure: string;
  concrete: string;
  bim: string;
  gridCell: string;
  gridSection: string;
}

const fallback: ScenePalette = {
  canvas: "#0a0f17",
  navy: "#1b3a5c",
  architecture: "#d9d4ca",
  glass: "#6f8ba8",
  structure: "#7fa6d4",
  concrete: "#8c949e",
  bim: "#c9a35b",
  gridCell: "#172233",
  gridSection: "#2a3b55",
};

/** Lee los colores 3D de las variables CSS de globals.css (una sola fuente de verdad). */
export function readScenePalette(): ScenePalette {
  if (typeof window === "undefined") return fallback;
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;
  return {
    canvas: v("--color-canvas", fallback.canvas),
    navy: v("--color-navy", fallback.navy),
    architecture: v("--color-3d-architecture", fallback.architecture),
    glass: v("--color-3d-glass", fallback.glass),
    structure: v("--color-3d-structure", fallback.structure),
    concrete: v("--color-3d-concrete", fallback.concrete),
    bim: v("--color-3d-bim", fallback.bim),
    gridCell: fallback.gridCell,
    gridSection: fallback.gridSection,
  };
}
