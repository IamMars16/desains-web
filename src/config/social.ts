export interface SocialNetwork {
  name: string;
  url: string;
}

/**
 * Redes sociales de la empresa. El brochure 2026 no incluye ninguna,
 * por eso la lista esta vacia. Ejemplo para agregar una:
 * { name: "LinkedIn", url: "https://www.linkedin.com/company/..." }
 */
export const socialNetworks: SocialNetwork[] = [];
