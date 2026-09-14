export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export type ServiceId =
  | "ingenieria-estructural"
  | "construccion"
  | "evaluacion-estructural"
  | "supervision"
  | "bim"
  | "estudios-especiales"
  | "hidraulica"
  | "arquitectura"
  | "revision-estructural";

export type SectorId =
  | "vivienda"
  | "educacion"
  | "salud"
  | "puentes"
  | "industria-mineria"
  | "deportes"
  | "institucional"
  | "transporte"
  | "agua-energia"
  | "comercio-turismo";

export interface KeyFact {
  label: string;
  value: string;
}

export interface ProjectVideo {
  src: string;
  poster: string;
  title: string;
}

export interface Project {
  slug: string;
  title: string;
  location?: string;
  region?: string;
  year?: number;
  client?: string;
  status?: string;
  /** Rol de DESAINS cuando no es el autor principal (revisor, colaborador). */
  role?: string;
  services: ServiceId[];
  sector: SectorId;
  summary: string;
  description?: string[];
  challenge?: string;
  solution?: string;
  engineering?: string[];
  keyFacts?: KeyFact[];
  participants?: KeyFact[];
  featured?: boolean;
  video?: ProjectVideo;
  /** Ruta a un .glb en /public/models cuando exista el modelo real del proyecto. */
  model3d?: string;
  /** Pagina del brochure de donde sale la informacion. */
  source: string;
}

export interface Professional {
  slug: string;
  name: string;
  role?: string;
  specialty: string;
  education: string[];
  summary: string;
  photo: ImageAsset;
  research?: string[];
  publications?: string[];
  featuredProjects?: string[];
}

export interface Service {
  id: ServiceId;
  name: string;
  summary: string;
  detail: string[];
  image: ImageAsset;
}

export interface SpecialStudy {
  id: string;
  name: string;
  summary: string;
  images: ImageAsset[];
}

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  details: string;
  year: number;
  doi: string;
  quartile: string;
}

export interface Software {
  id: "signal" | "probabilistic" | "match";
  name: string;
  summary: string;
  capabilities: string[];
  screenshot: ImageAsset;
}
