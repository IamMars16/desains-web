/** Textos del hero 3D. Cada capitulo aparece en un tramo del scroll (0 a 1). */
export const heroIntro = {
  brand: "DESAINS Ingenieros",
  title: "Ingeniería que transforma ideas en estructuras reales.",
  subtitle: "Diseñamos, evaluamos y construimos estructuras con investigación sísmica propia.",
};

export const heroChapters = [
  {
    id: "arquitectura",
    rail: "Arquitectura",
    title: "La forma define el esqueleto.",
    body: "Una arquitectura bien concebida permite que la estructura sea eficiente y económica.",
  },
  {
    id: "estructura",
    rail: "Estructura",
    title: "Detrás de cada fachada, un sistema que resiste.",
    body: "Columnas, vigas, losas y núcleo de muros de corte calculados para cumplir sus estados límite.",
  },
  {
    id: "sistema",
    rail: "Estructura",
    title: "Protección sísmica integrada.",
    body: "Modelo conceptual. Cada color identifica un elemento del sistema resistente.",
    legend: [
      { label: "Columnas y vigas", color: "var(--color-3d-structure)" },
      { label: "Losas", color: "var(--color-3d-concrete)" },
      { label: "Núcleo de muros de corte", color: "var(--color-navy)" },
      { label: "Disipadores de energía", color: "var(--color-3d-bim)" },
    ],
  },
  {
    id: "bim",
    rail: "BIM",
    title: "Ingeniería digital antes de construir.",
    body: "Gemelos digitales BIM para resolver interferencias y validar cada detalle en un entorno virtual.",
    link: { label: "Conocer el modelamiento BIM", href: "/servicios#bim" },
  },
];

export const heroRail = ["Arquitectura", "Estructura", "BIM"];
