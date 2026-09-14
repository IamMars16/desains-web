import type { Publication, Software } from "@/types/content";
import { siteImages } from "@/data/generated/images";

/** Articulos en revistas Q1 (brochure p. 6). */
export const publications: (Publication & { id: string })[] = [
  {
    id: "scale-factor-bidirectional-2025",
    title: "Scale Factor Model to Estimate the Maximum Bidirectional Spectral Demand in the South American Region",
    authors: "Arnold R. Mendo, Victor I. Fernandez-Davila",
    journal: "Earthquake Engineering & Structural Dynamics",
    details: "Volumen 54, número 11, pp. 2824-2846. Publicado en línea el 1 de junio de 2025.",
    year: 2025,
    doi: "10.1002/eqe.70003",
    quartile: "Q1",
  },
  {
    id: "damping-modification-isolation-2020",
    title: "Damping modification factors for the design of seismic isolation systems in Peru",
    authors: "Victor I. Fernandez-Davila, Arnold R. Mendo",
    journal: "Earthquake Spectra",
    details: "Volumen 36, número 4. Publicado en línea el 22 de junio de 2020.",
    year: 2020,
    doi: "10.1177/8755293020926189",
    quartile: "Q1",
  },
];

/** Ponencias en congresos internacionales (brochure p. 7). */
export const conferences = [
  { year: 2016, name: "XXXVII Jornadas Sudamericanas de Ingeniería Estructural" },
  { year: 2017, name: "16th World Conference on Earthquake Engineering" },
];

/** Revisiones como pares registradas en Web of Science (brochure p. 7). */
export const peerReviews = {
  journal: "Earthquake Engineering and Engineering Vibration",
  period: "junio a diciembre de 2025",
  items: [
    { title: "Probabilistic analysis of response spectra for varying damping ratios in regions with limited strong earthquake records", reviews: 2 },
    { title: "Neural networks-based prediction of damping modification factors accounting for magnitude, distance, and site conditions", reviews: 1 },
  ],
};

/** Software propio (brochure pp. 8-9). */
export const software: Software[] = [
  {
    id: "signal",
    name: "SOFIPS.SIGNAL",
    summary: "Análisis y procesamiento avanzado de señales sísmicas.",
    capabilities: [
      "Evalúa características fundamentales del sismo, como la direccionalidad",
      "Calcula la nueva generación de medidas de intensidad",
      "Alta eficiencia y robustez",
    ],
    screenshot: { ...siteImages["innovacion/sofips-signal"], alt: "Interfaz de SOFIPS.SIGNAL con espectro de Fourier" },
  },
  {
    id: "probabilistic",
    name: "SOFIPS.PROBABILISTIC",
    summary: "Evaluación probabilística del colapso estructural.",
    capabilities: [
      "Ejecuta análisis dinámicos incrementales (IDA)",
      "Integración directa con ETABS, SAP2000 y OpenSees",
    ],
    screenshot: { ...siteImages["innovacion/sofips-probabilistic"], alt: "Interfaz de SOFIPS.PROBABILISTIC con registro sísmico" },
  },
  {
    id: "match",
    name: "SOFIPS.MATCH",
    summary: "Selección y ajuste de registros sísmicos.",
    capabilities: [
      "Optimiza la calidad y precisión de los datos de entrada",
      "Pensado para el análisis estructural no lineal",
    ],
    screenshot: { ...siteImages["innovacion/sofips-match"], alt: "Interfaz de SOFIPS.MATCH con espectros ajustados" },
  },
];

/** Investigacion en disipadores (brochure p. 10). */
export const dissipatorResearch = {
  title: "Disipador sísmico híbrido U-SHAPE con panel de corte",
  summary:
    "Estamos desarrollando un sistema híbrido de disipación de energía, altamente eficiente y de bajo costo, concebido para proteger edificaciones ante eventos sísmicos severos.",
  detail: "El dispositivo se basa en la tecnología U-SHAPE integrada con un panel de corte.",
  images: [
    { ...siteImages["innovacion/disipador-esquema"], alt: "Modelo del disipador U-SHAPE con panel de corte" },
    { ...siteImages["innovacion/disipador-1"], alt: "Prototipos de placas en U del disipador" },
    { ...siteImages["innovacion/disipador-3"], alt: "Curvas de histéresis fuerza-deformación del ensayo" },
    { ...siteImages["innovacion/disipador-2"], alt: "Disipador instalado en arriostre diagonal" },
  ],
};
