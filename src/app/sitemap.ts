import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { professionals } from "@/data/professionals";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/proyectos", "/servicios", "/innovacion", "/profesionales", "/nosotros", "/contacto"].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...projects.map((p) => ({ url: `${siteUrl}/proyectos/${p.slug}`, lastModified: now, priority: 0.6 })),
    ...professionals.map((p) => ({ url: `${siteUrl}/profesionales/${p.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
