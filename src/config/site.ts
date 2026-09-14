/**
 * URL publica del sitio. En Vercel se toma de NEXT_PUBLIC_SITE_URL;
 * al conectar un dominio propio basta con cambiar esa variable.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const siteMeta = {
  title: "DESAINS Ingenieros | Ingeniería estructural, investigación y construcción",
  description:
    "Ingeniería estructural, evaluación, supervisión, BIM e investigación sísmica. Proyectos en el Perú desde 2006.",
  locale: "es_PE",
};
