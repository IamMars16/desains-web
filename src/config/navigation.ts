export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Proyectos", href: "/proyectos" },
  { label: "Servicios", href: "/servicios" },
  { label: "Innovación", href: "/innovacion" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Nosotros", href: "/nosotros" },
];

export const contactNav: NavItem = { label: "Contacto", href: "/contacto" };

/** Una etiqueta por intencion en todo el sitio. */
export const ctaLabels = {
  projects: "Ver proyectos",
  team: "Conocer a nuestros ingenieros",
  start: "Iniciar un proyecto",
  quote: "Solicitar cotización",
} as const;
