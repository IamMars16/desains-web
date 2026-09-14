/**
 * Geometria del icono DESAINS en 6 piezas, trazada sobre el logo original.
 * Coordenadas en pixeles de la imagen de referencia (y hacia abajo).
 * La usan el logo SVG de la interfaz y el logo 3D, asi ambos coinciden.
 */
export type Point = readonly [number, number];

export interface LogoPiece {
  id: "columna" | "brazo-superior" | "triangulo" | "escuadra" | "brazo-inferior" | "soporte";
  name: string;
  outer: Point[];
  hole?: Point[];
  /** Profundidad relativa para el relieve 3D. */
  depth: number;
}

export const LOGO_VIEWBOX = { x: 220, y: 38, width: 548, height: 766 } as const;

export const logoPieces: LogoPiece[] = [
  {
    id: "columna",
    name: "Columna",
    outer: [[368, 75], [410, 42], [452, 75], [452, 770], [410, 800], [368, 770]],
    depth: 1,
  },
  {
    id: "soporte",
    name: "Soporte izquierdo",
    outer: [[366, 285], [225, 350], [225, 500], [366, 548]],
    hole: [[366, 324.7], [259, 374], [259, 473.5], [366, 510]],
    depth: 0.7,
  },
  {
    id: "escuadra",
    name: "Escuadra interior",
    outer: [[458, 338], [486, 338], [486, 662], [722, 569], [722, 595], [458, 699]],
    depth: 0.7,
  },
  {
    id: "triangulo",
    name: "Triángulo",
    outer: [[458, 150], [712, 250], [458, 330]],
    hole: [[486, 191], [628, 247], [486, 292]],
    depth: 0.85,
  },
  {
    id: "brazo-inferior",
    name: "Brazo inferior",
    outer: [[310, 778], [348, 752], [738, 598], [762, 596], [748, 642], [348, 800]],
    depth: 0.9,
  },
  {
    id: "brazo-superior",
    name: "Brazo superior",
    outer: [[310, 70], [345, 45], [752, 205], [742, 322], [722, 248], [345, 97]],
    depth: 0.9,
  },
];

export function toSvgPath(piece: LogoPiece): string {
  const ring = (pts: Point[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
  return ring(piece.outer) + (piece.hole ? ring(piece.hole) : "");
}
