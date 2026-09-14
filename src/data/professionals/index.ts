import type { Professional } from "@/types/content";
import { siteImages } from "@/data/generated/images";

/** Plantel tecnico segun el brochure 2026 (p. 5). La especialidad se deriva de su formacion. */
export const professionals: Professional[] = [
  {
    slug: "arnold-mendo",
    name: "Arnold Ramsey Mendo Rodríguez",
    role: "Gerente general",
    specialty: "Ingeniería estructural e ingeniería sísmica",
    education: [
      "Ingeniero civil, Universidad Nacional de Cajamarca",
      "Magíster en Ingeniería Civil con posgrado en Ingeniería Estructural, Pontificia Universidad Católica del Perú",
      "Doctorado en Ingeniería, Pontificia Universidad Católica del Perú",
    ],
    summary:
      "Ingeniero civil con maestría y doctorado en ingeniería por la Pontificia Universidad Católica del Perú. Autor de dos artículos en revistas Q1 de ingeniería sísmica.",
    photo: { ...siteImages["team/arnold-mendo"], alt: "Arnold Ramsey Mendo Rodríguez" },
    research: ["Cálculo de mapas de peligro sísmico (Mendo, 2015)", "Espectros de probabilidad uniforme en sitios específicos (Mendo, 2015)"],
    publications: ["scale-factor-bidirectional-2025", "damping-modification-isolation-2020"],
  },
  {
    slug: "miguel-mosqueira",
    name: "Miguel Ángel Mosqueira Moreno",
    specialty: "Ingeniería estructural",
    education: [
      "Ingeniero civil, Universidad Nacional de Cajamarca",
      "Magíster en Ingeniería Civil con posgrado en Ingeniería Estructural, Pontificia Universidad Católica del Perú",
      "Doctor en Ciencia e Ingeniería, Universidad Nacional de Trujillo",
    ],
    summary:
      "Ingeniero civil con maestría en Ingeniería Civil por la Pontificia Universidad Católica del Perú y doctorado en Ciencia e Ingeniería.",
    photo: { ...siteImages["team/miguel-mosqueira"], alt: "Miguel Ángel Mosqueira Moreno" },
  },
  {
    slug: "jorge-huatay",
    name: "Jorge Luis Huatay Castrejón",
    specialty: "Gerencia de la construcción e ingeniería geotécnica",
    education: [
      "Ingeniero civil, Universidad Nacional de Cajamarca",
      "Maestría en Ingeniería y Gerencia de la Construcción, Universidad Nacional de Cajamarca",
      "Maestría en Ingeniería Geotécnica, Universidad Nacional de Ingeniería",
    ],
    summary: "Ingeniero civil con maestrías en gerencia de la construcción y en ingeniería geotécnica.",
    photo: { ...siteImages["team/jorge-huatay"], alt: "Jorge Luis Huatay Castrejón" },
  },
  {
    slug: "tania-cruz",
    name: "Tania Lucila Cruz Cerna",
    specialty: "Contrataciones del Estado",
    education: ["Ingeniera civil, Universidad Nacional de Cajamarca", "Especialista en contrataciones del Estado"],
    summary: "Ingeniera civil especialista en contrataciones del Estado.",
    photo: { ...siteImages["team/tania-cruz"], alt: "Tania Lucila Cruz Cerna" },
  },
  {
    slug: "javier-taipe",
    name: "Javier Francisco Taipe Carbajal",
    specialty: "Ingeniería estructural",
    education: [
      "Ingeniero civil, Universidad Nacional de San Cristóbal de Huamanga",
      "Maestro en Ciencias con mención en Ingeniería Estructural, Universidad Nacional de Ingeniería",
      "Doctorado en Ingeniería, Pontificia Universidad Católica del Perú",
    ],
    summary:
      "Ingeniero civil, maestro en Ciencias con mención en Ingeniería Estructural y doctorado en Ingeniería por la Pontificia Universidad Católica del Perú.",
    photo: { ...siteImages["team/javier-taipe"], alt: "Javier Francisco Taipe Carbajal" },
  },
];

export function getProfessional(slug: string) {
  return professionals.find((p) => p.slug === slug);
}
