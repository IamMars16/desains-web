/**
 * Modelo parametrico del edificio del hero. Unidades en metros, Y hacia arriba.
 * Solo datos: transformaciones por instancia y metadatos (nivel, normal de cara)
 * que la escena usa para revelar capas sin perder la identidad de cada pieza.
 */

export interface Box {
  /** Centro */
  p: [number, number, number];
  /** Dimensiones */
  s: [number, number, number];
  /** Nivel al que pertenece (0 = planta baja). */
  level: number;
  /** Normal horizontal de la cara de fachada (para separar la fachada). */
  n?: [number, number];
  /** Rotacion en Y (radianes) para piezas inclinadas en fachada. */
  ry?: number;
  /** Rotacion en Z local (para diagonales). */
  rz?: number;
  shade?: number;
}

export interface BuildingSpec {
  floors: number;
  fins: boolean;
}

export const GRID_X = [-12, -6, 0, 6, 12];
export const GRID_Z = [-9, -3, 3, 9];
export const AXIS_X = ["A", "B", "C", "D", "E"];
export const AXIS_Z = ["1", "2", "3", "4"];
const GROUND_H = 5;
const STORY_H = 3.6;
const FACADE_OFFSET = 0.75;
const MODULE = 1.5;

export function levelElevation(i: number): number {
  return i === 0 ? 0 : GROUND_H + (i - 1) * STORY_H;
}

const inCore = (x: number, z: number) => Math.abs(x) <= 6 && Math.abs(z) <= 3;

/** Pseudoaleatorio determinista para variaciones de tono del vidrio. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildModel({ floors, fins }: BuildingSpec) {
  const roof = levelElevation(floors);
  const xMin = GRID_X[0];
  const xMax = GRID_X[GRID_X.length - 1];
  const zMin = GRID_Z[0];
  const zMax = GRID_Z[GRID_Z.length - 1];

  const columns: Box[] = [];
  const beams: Box[] = [];
  const cores: Box[] = [];
  const braces: Box[] = [];
  const dampers: Box[] = [];
  const slabs: Box[] = [];

  for (let lv = 0; lv < floors; lv++) {
    const y0 = levelElevation(lv);
    const y1 = levelElevation(lv + 1);
    const h = y1 - y0;

    for (const x of GRID_X) {
      for (const z of GRID_Z) {
        if (inCore(x, z)) continue;
        columns.push({ p: [x, y0 + h / 2, z], s: [0.7, h, 0.7], level: lv });
      }
    }

    // Nucleo de muros de corte (ejes B-D / 2-3).
    const t = 0.4;
    cores.push({ p: [0, y0 + h / 2, -3], s: [12 + t, h, t], level: lv });
    cores.push({ p: [0, y0 + h / 2, 3], s: [12 + t, h, t], level: lv });
    cores.push({ p: [-6, y0 + h / 2, 0], s: [t, h, 6], level: lv });
    cores.push({ p: [6, y0 + h / 2, 0], s: [t, h, 6], level: lv });

    // Arriostres en V invertida con disipador en el vertice (fachadas largas y cortas).
    if (lv > 0) {
      const bays: { a: [number, number]; b: [number, number] }[] = [
        { a: [-6, zMax], b: [0, zMax] },
        { a: [0, zMax], b: [6, zMax] },
        { a: [-6, zMin], b: [0, zMin] },
        { a: [0, zMin], b: [6, zMin] },
        { a: [xMin, -3], b: [xMin, 3] },
        { a: [xMax, -3], b: [xMax, 3] },
      ];
      for (const { a, b } of bays) {
        const midX = (a[0] + b[0]) / 2;
        const midZ = (a[1] + b[1]) / 2;
        const alongX = a[1] === b[1];
        const half = alongX ? Math.abs(b[0] - a[0]) / 2 : Math.abs(b[1] - a[1]) / 2;
        const rise = h - 0.9;
        const len = Math.hypot(half, rise);
        const ang = Math.atan2(rise, half);
        for (const side of [-1, 1]) {
          const cx = alongX ? midX + (side * half) / 2 : midX;
          const cz = alongX ? midZ : midZ + (side * half) / 2;
          braces.push({
            p: [cx, y0 + rise / 2, cz],
            s: [len, 0.28, 0.28],
            level: lv,
            ry: alongX ? 0 : -Math.PI / 2,
            rz: side < 0 ? ang : -ang,
          });
        }
        dampers.push({
          p: [midX, y0 + rise + 0.25, midZ],
          s: alongX ? [1.1, 0.5, 0.45] : [0.45, 0.5, 1.1],
          level: lv,
        });
      }
    }
  }

  for (let lv = 1; lv <= floors; lv++) {
    const y = levelElevation(lv);
    slabs.push({ p: [0, y - 0.125, 0], s: [xMax - xMin + 0.8, 0.25, zMax - zMin + 0.8], level: lv });
    for (const z of GRID_Z) {
      for (let i = 0; i < GRID_X.length - 1; i++) {
        const xa = GRID_X[i];
        const xb = GRID_X[i + 1];
        if (inCore((xa + xb) / 2, z) && Math.abs(z) === 3) continue;
        beams.push({ p: [(xa + xb) / 2, y - 0.6, z], s: [xb - xa, 0.7, 0.4], level: lv });
      }
    }
    for (const x of GRID_X) {
      for (let i = 0; i < GRID_Z.length - 1; i++) {
        const za = GRID_Z[i];
        const zb = GRID_Z[i + 1];
        if (inCore(x, (za + zb) / 2) && Math.abs(x) === 6) continue;
        beams.push({ p: [x, y - 0.6, (za + zb) / 2], s: [0.4, 0.7, zb - za], level: lv });
      }
    }
  }

  // ---------- Fachada ----------
  const glass: Box[] = [];
  const mullions: Box[] = [];
  const spandrels: Box[] = [];
  const finsList: Box[] = [];
  const lights: Box[] = [];

  const faces = [
    { n: [0, 1] as [number, number], len: xMax - xMin + 2 * FACADE_OFFSET, pos: zMax + FACADE_OFFSET, alongX: true },
    { n: [0, -1] as [number, number], len: xMax - xMin + 2 * FACADE_OFFSET, pos: zMin - FACADE_OFFSET, alongX: true },
    { n: [1, 0] as [number, number], len: zMax - zMin + 2 * FACADE_OFFSET, pos: xMax + FACADE_OFFSET, alongX: false },
    { n: [-1, 0] as [number, number], len: zMax - zMin + 2 * FACADE_OFFSET, pos: xMin - FACADE_OFFSET, alongX: false },
  ];

  for (let lv = 0; lv < floors; lv++) {
    const y0 = levelElevation(lv);
    const y1 = levelElevation(lv + 1);
    const band = lv === 0 ? 0 : 0.95;
    const gh = y1 - y0 - band;
    const gy = y0 + band + gh / 2;
    const recess = lv === 0 ? 1.6 : 0;

    faces.forEach((f, fi) => {
      const len = f.len - 2 * recess;
      const count = Math.round(len / MODULE);
      const mod = len / count;
      const pos = f.pos - (f.n[0] + f.n[1]) * recess;
      for (let m = 0; m < count; m++) {
        const u = -len / 2 + mod * (m + 0.5);
        const shade = 0.72 + rand(lv * 97 + fi * 13 + m) * 0.28;
        glass.push({
          p: f.alongX ? [u, gy, pos] : [pos, gy, u],
          s: f.alongX ? [mod - 0.06, gh, 0.06] : [0.06, gh, mod - 0.06],
          level: lv,
          n: f.n,
          shade,
        });
      }
      for (let m = 0; m <= count; m++) {
        const u = -len / 2 + mod * m;
        mullions.push({
          p: f.alongX ? [u, gy, pos + f.n[1] * 0.08] : [pos + f.n[0] * 0.08, gy, u],
          s: f.alongX ? [0.07, gh, 0.2] : [0.2, gh, 0.07],
          level: lv,
          n: f.n,
        });
      }
      if (band > 0) {
        const bl = f.len + 0.2;
        spandrels.push({
          p: f.alongX ? [0, y0 + band / 2, f.pos + f.n[1] * 0.12] : [f.pos + f.n[0] * 0.12, y0 + band / 2, 0],
          s: f.alongX ? [bl, band, 0.3] : [0.3, band, bl],
          level: lv,
          n: f.n,
        });
      }
    });

    // Volumen de luz interior: hace legible el vidrio desde fuera.
    lights.push({
      p: [0, y0 + band + gh * 0.55, 0],
      s: [xMax - xMin - 1.2, gh * 0.7, zMax - zMin - 1.2],
      level: lv,
      shade: 0.6 + rand(lv * 31) * 0.4,
    });
  }

  // Coronacion sobre la cubierta.
  const crownH = 2.4;
  faces.forEach((f) => {
    const bl = f.len + 0.2;
    spandrels.push({
      p: f.alongX ? [0, roof + crownH / 2, f.pos] : [f.pos, roof + crownH / 2, 0],
      s: f.alongX ? [bl, crownH, 0.3] : [0.3, crownH, bl],
      level: floors,
      n: f.n,
    });
  });

  if (fins) {
    faces.slice(0, 2).forEach((f) => {
      const count = Math.round(f.len / MODULE);
      for (let m = 0; m <= count; m += 3) {
        const u = -f.len / 2 + MODULE * m;
        const h = roof - GROUND_H;
        finsList.push({
          p: [u, GROUND_H + h / 2, f.pos + f.n[1] * 0.4],
          s: [0.12, h, 0.55],
          level: floors,
          n: f.n,
        });
      }
    });
  }

  return {
    roof,
    structure: { columns, beams, cores, braces, dampers, slabs },
    facade: { glass, mullions, spandrels, fins: finsList, lights },
    foundation: { p: [0, -0.6, 0] as [number, number, number], s: [xMax - xMin + 4, 1.2, zMax - zMin + 4] as [number, number, number] },
  };
}

export type BuildingModel = ReturnType<typeof buildModel>;
