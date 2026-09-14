import type { Project } from "@/types/content";

/** Obras ejecutadas por DESAINS (brochure pp. 16-17, 22-25). */
export const constructionProjects: Project[] = [
  {
    slug: "centro-educativo-manthoc",
    title: "Construcción del centro educativo MANTHOC",
    location: "Cajamarca",
    region: "Cajamarca",
    year: 2007,
    status: "Construido",
    services: ["construccion"],
    sector: "educacion",
    summary:
      "Cerco perimetral de 100 m, pabellón de dos niveles con 4 aulas y módulo de servicios higiénicos, con sistema reticular mixto TRIDILOSA.",
    description: [
      "Este proyecto abarcó la construcción del cerco perimetral de 100 m, la construcción de un pabellón de dos niveles con 4 aulas y un módulo de servicios higiénicos de dos niveles.",
    ],
    solution:
      "El principal aspecto del sistema estructural es el empleo de un sistema reticular mixto denominado TRIDILOSA.",
    engineering: [
      "TRIDILOSA: estructura metálica con losa de concreto de 0,05 m de espesor",
      "Reducido peso y elevada inercia a la flexión frente a la acción sísmica",
    ],
    keyFacts: [
      { label: "Cerco perimetral", value: "100 m" },
      { label: "Pabellón", value: "2 niveles, 4 aulas" },
      { label: "Espesor de losa", value: "0,05 m" },
    ],
    source: "Brochure 2026, p. 22",
  },
  {
    slug: "modulo-educacion-inicial-davy",
    title: "Módulo de educación inicial de la Asociación Educativa Davy",
    client: "Asociación Educativa Davy",
    year: 2010,
    status: "Construido",
    services: ["construccion"],
    sector: "educacion",
    summary: "Sexto módulo del proyecto de inicial: dos aulas con servicios higiénicos para infantes menores de 5 años.",
    description: [
      "Esta obra es el sexto módulo del proyecto de inicial de la Asociación Educativa Davy. Consta de dos aulas que cuentan con servicios higiénicos destinados al uso de infantes menores de 5 años.",
    ],
    keyFacts: [{ label: "Aulas", value: "2" }],
    source: "Brochure 2026, pp. 17 y 22",
  },
  {
    slug: "camerinos-mantenimiento-davy",
    title: "Camerinos para el personal de mantenimiento de la Asociación Educativa Davy",
    client: "Asociación Educativa Davy",
    year: 2010,
    status: "Construido",
    services: ["construccion"],
    sector: "educacion",
    summary: "Dos módulos de camerinos y un container acondicionado como vestidores, con cubierta metálica de perfiles tubulares.",
    description: [
      "Esta obra abarcó la construcción de dos módulos y el acondicionamiento de un container ubicado en la zona central entre ambos módulos. En cada camerino se construyeron duchas y vestidores, y el container fue acondicionado para ser usado como vestidor.",
    ],
    engineering: ["Cubierta con estructura metálica de perfiles tubulares de pared delgada"],
    source: "Brochure 2026, p. 22",
  },
  {
    slug: "almacen-general-davy",
    title: "Almacén general de la Asociación Educativa Davy",
    client: "Asociación Educativa Davy",
    year: 2010,
    status: "Construido",
    services: ["construccion"],
    sector: "educacion",
    summary: "Almacén dividido en dos zonas, de libros y de materiales, con techo de tijerales tubulares y perfiles Z.",
    description: [
      "En este proyecto se construyó el almacén general de la Asociación Educativa Davy. El espacio fue dividido en dos zonas: la primera funciona como almacén de libros y la segunda como almacén de materiales.",
    ],
    engineering: [
      "Tijerales de perfiles tubulares de pared delgada",
      "Soporte de planchas de cubierta con perfiles Z laminados en frío",
    ],
    source: "Brochure 2026, p. 23",
  },
  {
    slug: "taller-de-musica-davy",
    title: "Remodelación y ampliación del taller de música de la Asociación Educativa Davy",
    client: "Asociación Educativa Davy",
    status: "Construido",
    services: ["construccion", "arquitectura"],
    sector: "educacion",
    summary:
      "Ampliación y acondicionamiento acústico del taller, con demolición de dos muros de corte y refuerzo de vanos con pórticos de acero.",
    description: [
      "El proyecto abarcó la ampliación y el acondicionamiento del taller de música mediante la instalación de fibra de vidrio recubierta con tapiz en las paredes y baldosas acústicas en el cielo raso para absorber el sonido.",
    ],
    challenge: "Uno de los trabajos más importantes fue la demolición de dos muros de corte de concreto de las aulas existentes.",
    solution: "Los vanos resultantes se reforzaron mediante pórticos de acero.",
    engineering: ["Refuerzo de vanos con pórticos de acero", "Acondicionamiento acústico"],
    source: "Brochure 2026, pp. 16, 23 y 29",
  },
  {
    slug: "taller-de-arte-davy",
    title: "Remodelación y ampliación del taller de arte de la Asociación Educativa Davy",
    client: "Asociación Educativa Davy",
    status: "Construido",
    services: ["construccion", "arquitectura"],
    sector: "educacion",
    summary:
      "Demolición de un muro de corte existente y refuerzo con un pórtico de concreto armado que forma el marco de una mampara plegable.",
    challenge: "La ampliación contempló la demolición de un muro de corte de la estructura existente.",
    solution:
      "El refuerzo se realizó mediante la incorporación de un pórtico de concreto armado, que además formó el marco de una mampara plegable.",
    engineering: ["Pórtico de concreto armado de refuerzo"],
    source: "Brochure 2026, pp. 16, 24 y 25",
  },
];
